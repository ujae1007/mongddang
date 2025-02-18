# app/internal/recommendation.py
import numpy as np
import pandas as pd
import tensorflow as tf
import pickle
import mysql.connector
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.sequence import pad_sequences
from app import dependencies
import os


def get_query_data():
    db_config = {
        "host": dependencies.DATABASE_HOST,   
        "port": dependencies.DATABASE_PORT,   # MySQL 포트 번호호
        "user": dependencies.DATABASE_USER,   # MySQL 사용자 이름
        "password": dependencies.DATABASE_PASSWORD, # MySQL 비밀번호
    }

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute("USE mongddang;")

    query = """
        SELECT 
            a.album_id,
            a.title,
            (
                -- 지역 매칭 횟수
                SUM(
                    CASE 
                        WHEN p.location_address IN (u.like_region1, u.like_region2, u.like_region3) 
                        THEN 1 
                        ELSE 0 
                    END
                )
                +
                -- 장르 매칭 횟수
                SUM(
                    CASE 
                        WHEN m.genre IN (u.like_genre1, u.like_genre2, u.like_genre3) 
                        THEN 1 
                        ELSE 0 
                    END
                )
            ) AS total_match
        FROM album AS a
        JOIN playlist AS p 
            ON a.album_id = p.album_id
        JOIN music AS m 
            ON p.music_id = m.music_id
        JOIN user AS u
            ON u.user_id = %s
        -- liked 테이블을 LEFT JOIN
        LEFT JOIN `like` AS l
            ON l.album_id = a.album_id
            AND l.user_id = %s 
        WHERE 
            a.user_id != %s  
            AND l.album_id IS NULL
        GROUP BY a.album_id
        ORDER BY total_match DESC
        LIMIT 3;
        """
    cursor.execute(query, (user_id, user_id, user_id))
    query_rec = cursor.fetchall()

    query_data = [num[0] for num in query_rec]

    return query_data


def export_data_to_csv():
    # MySQL 데이터베이스 연결 설정
    db_config = {
        "host": dependencies.DATABASE_HOST,   
        "port": dependencies.DATABASE_PORT,   # MySQL 포트 번호호
        "user": dependencies.DATABASE_USER,   # MySQL 사용자 이름
        "password": dependencies.DATABASE_PASSWORD, # MySQL 비밀번호
    }
    
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute("USE mongddang;")


    try:
        # SQL 쿼리 정의 (테이블 이름은 실제 DB에 맞게 수정)
        # 유저 데이터 저장
        query_user = """
            SELECT 
                user_id, like_region1, like_region2, like_region3, like_genre1, like_genre2, like_genre3 
            FROM user;
        """
        cursor.execute(query_user)
        user_data = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        user_df = pd.DataFrame(user_data, columns=columns)

        # 게시글 데이터 저장
        query_post = """
            SELECT
                a.album_id,
                a.user_id,
                a.title,
                p.location_address,
                m.genre
            FROM album AS a
            JOIN playlist AS p 
                ON a.album_id = p.album_id
            JOIN music AS m
                ON p.music_id = m.music_id;
        """
        cursor.execute(query_post)
        post_data = cursor.fetchall()
        columns = ["post_id", "author", "title", "region", "genres"]
        post_df = pd.DataFrame(post_data, columns=columns)
        post_df = post_df.groupby(
            ["post_id", "author", "title"], as_index=False
        ).agg({
            "region": lambda x: ", ".join(set(x)),  # 가장 높은 popularity 선택
            "genres": lambda x: ", ".join(set(x))  # 중복 장르 제거 후 합침
        })

        # 좋아요 데이터 저장
        query_interaction = """
            SELECT 
                user_id, album_id
            FROM `like`;
        """
        cursor.execute(query_interaction)
        interaction_data = cursor.fetchall()
        interaction_df = pd.DataFrame(interaction_data, columns=["user_id", "album_id"])

        inter_matrix = user_df.assign(key=1).merge(post_df.assign(key=1), on="key").drop(columns=["key"])
        inter_matrix = inter_matrix[["user_id", "post_id"]]
        inter_matrix["liked"] = 0

        inter_matrix.loc[inter_matrix.set_index(["user_id", "post_id"]).index.isin(interaction_df.set_index(["user_id", "album_id"]).index),"liked"] = 1

        # CSV 파일로 저장
        user_df.to_csv('./app/internal/data/user_data.csv', index=False)
        post_df.to_csv('./app/internal/data/post_data.csv', index=False)
        inter_matrix.to_csv('./app/internal/data/interaction_data.csv', index=False)

    finally:
        conn.close()


def train_and_save_model():
    export_data_to_csv()

    user_data = pd.read_csv('./app/internal/data/user_data.csv')
    post_data = pd.read_csv('./app/internal/data/post_data.csv')
    interaction_data = pd.read_csv('./app/internal/data/interaction_data.csv')

    # 데이터 병합
    data = interaction_data.merge(user_data, on='user_id', how='left')
    data = data.merge(post_data, on='post_id', how='left')

    # === 다중 값 컬럼(게시글 제목, 지역, 장르)을 모두 사용하도록 전처리 ===
    # 각 컬럼을 콤마로 분리하여 토큰 리스트 생성
    data['post_title_list'] = data['title'].apply(lambda x: [t.strip() for t in x.split(',')])
    data['post_region_list'] = data['region'].apply(lambda x: [t.strip() for t in x.split(',')])
    data['post_genre_list'] = data['genres'].apply(lambda x: [t.strip() for t in x.split(',')])

    # vocabulary 구축 함수
    def build_vocab(list_series):
        vocab = set()
        for lst in list_series:
            vocab.update(lst)
        return sorted(vocab)

    vocab_title = build_vocab(data['post_title_list'])
    vocab_region = build_vocab(data['post_region_list'])
    vocab_genre = build_vocab(data['post_genre_list'])

    # 각 vocabulary에 대해 매핑 (0은 패딩용으로 남김)
    title_mapping = {token: idx + 1 for idx, token in enumerate(vocab_title)}
    region_mapping = {token: idx + 1 for idx, token in enumerate(vocab_region)}
    genre_mapping = {token: idx + 1 for idx, token in enumerate(vocab_genre)}

    # 토큰 리스트를 정수 인덱스 리스트로 변환
    data['post_title_enc_list'] = data['post_title_list'].apply(lambda lst: [title_mapping[t] for t in lst])
    data['post_region_enc_list'] = data['post_region_list'].apply(lambda lst: [region_mapping[t] for t in lst])
    data['post_genre_enc_list'] = data['post_genre_list'].apply(lambda lst: [genre_mapping[t] for t in lst])

    # 각 컬럼의 최대 시퀀스 길이 계산
    max_title_len = data['post_title_enc_list'].apply(len).max()
    max_region_len = data['post_region_enc_list'].apply(len).max()
    max_genre_len = data['post_genre_enc_list'].apply(len).max()

    # 시퀀스 패딩 (padding='post'로 오른쪽에 0 추가)
    title_padded = pad_sequences(data['post_title_enc_list'].tolist(), maxlen=max_title_len, padding='post')
    region_padded = pad_sequences(data['post_region_enc_list'].tolist(), maxlen=max_region_len, padding='post')
    genre_padded = pad_sequences(data['post_genre_enc_list'].tolist(), maxlen=max_genre_len, padding='post')

    # === 스칼라(단일 값) 컬럼 인코딩 (사용자 선호, user_id, post_id) ===
    encoders = {}

    for col in ['like_region1', 'like_region2', 'like_region3', 
                'like_genre1', 'like_genre2', 'like_genre3']:
        encoder = LabelEncoder()
        data[col + '_enc'] = encoder.fit_transform(data[col])
        encoders[col + '_encoder'] = encoder

    user_encoder = LabelEncoder()
    data['user_id_enc'] = user_encoder.fit_transform(data['user_id'])
    encoders['user_encoder'] = user_encoder

    post_encoder = LabelEncoder()
    data['post_id_enc'] = post_encoder.fit_transform(data['post_id'])
    encoders['post_encoder'] = post_encoder

    # 학습 타깃
    y = data['liked']

    # 학습/검증 분리 (인덱스 기준)
    indices = np.arange(len(data))
    train_idx, test_idx = train_test_split(indices, test_size=0.2, random_state=42)

    # 스칼라 입력 데이터
    scalar_features = ['user_id_enc', 'like_region1_enc', 'like_region2_enc', 'like_region3_enc',
                       'like_genre1_enc', 'like_genre2_enc', 'like_genre3_enc', 'post_id_enc']
    X_scalar = {col: data[col].values for col in scalar_features}

    # 시퀀스 입력 데이터 (패딩된 배열 사용)
    X_seq = {
        'post_title_seq': title_padded,
        'post_region_seq': region_padded,
        'post_genre_seq': genre_padded
    }

    # 학습 데이터 구성 (train)
    X_train = {}
    for col in scalar_features:
        X_train[col] = X_scalar[col][train_idx]
    for col in X_seq:
        X_train[col] = X_seq[col][train_idx]
    y_train = y.values[train_idx]

    # 검증 데이터 구성 (test)
    X_test = {}
    for col in scalar_features:
        X_test[col] = X_scalar[col][test_idx]
    for col in X_seq:
        X_test[col] = X_seq[col][test_idx]
    y_test = y.values[test_idx]

    # === 모델 정의 ===
    embedding_dim = 8
    inputs = {}
    embeddings = []

    # 스칼라 입력: 각 입력은 shape=(1,)
    for col in scalar_features:
        inputs[col] = tf.keras.layers.Input(shape=(1,), name=col)
        vocab_size = data[col].nunique() + 1  # +1은 패딩 인덱스 고려
        emb = tf.keras.layers.Embedding(input_dim=vocab_size, output_dim=embedding_dim)(inputs[col])
        embeddings.append(tf.keras.layers.Flatten()(emb))

    # 시퀀스 입력: shape=(max_len,)
    # 각 시퀀스 컬럼에 대해 GlobalAveragePooling1D로 고정 벡터로 합침
    sequence_info = {
        'post_title_seq': (max_title_len, len(title_mapping) + 1),
        'post_region_seq': (max_region_len, len(region_mapping) + 1),
        'post_genre_seq': (max_genre_len, len(genre_mapping) + 1)
    }

    for col, (max_len, vocab_size) in sequence_info.items():
        inputs[col] = tf.keras.layers.Input(shape=(max_len,), name=col)
        emb = tf.keras.layers.Embedding(input_dim=vocab_size, output_dim=embedding_dim, mask_zero=True)(inputs[col])
        pooled = tf.keras.layers.GlobalAveragePooling1D()(emb)
        embeddings.append(pooled)

    deep_input = tf.keras.layers.Concatenate()(embeddings)
    dense_1 = tf.keras.layers.Dense(128, activation='relu')(deep_input)
    dense_2 = tf.keras.layers.Dense(64, activation='relu')(dense_1)
    output = tf.keras.layers.Dense(1, activation='sigmoid')(dense_2)

    xdeepfm = tf.keras.Model(inputs=list(inputs.values()), outputs=output)
    xdeepfm.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # 모델 학습
    xdeepfm.fit(X_train, y_train, epochs=30, batch_size=32, validation_split=0.2)

    # 모델 저장
    xdeepfm.save('./models/xdeepfm/xdeepfm.keras')
    dependencies.xdeepfm = xdeepfm

    # 추가: 시퀀스 관련 매핑과 최대 길이 정보도 함께 저장 (추후 예측 시 필요)
    encoders['title_mapping'] = title_mapping
    encoders['region_mapping'] = region_mapping
    encoders['genre_mapping'] = genre_mapping
    encoders['max_title_len'] = max_title_len
    encoders['max_region_len'] = max_region_len
    encoders['max_genre_len'] = max_genre_len

    # 인코더 저장 (pickle 사용)
    with open('./models/xdeepfm/encoders.pkl', 'wb') as f:
        pickle.dump(encoders, f)


def recommend_posts_for_user_input(user_id: int,
                                   like_region1: str,
                                   like_region2: str,
                                   like_region3: str,
                                   like_genre1: str,
                                   like_genre2: str,
                                   like_genre3: str,
                                   top_n: int = 50):
    """
    사용자 정보(유저 id, 선호 지역/장르)를 인코딩하여, 저장된 모델과 인코더를 활용해
    추천 게시글 상위 top_n개를 반환합니다.
    반환값: 추천 게시글 정보를 담은 dict 리스트
    """
    # CSV 데이터 로드
    user_data = pd.read_csv('./app/internal/data/user_data.csv')
    post_data = pd.read_csv('./app/internal/data/post_data.csv')
    interaction_data = pd.read_csv('./app/internal/data/interaction_data.csv')

    # 인코더 로드 (학습 시 저장한 인코더 사용)
    with open('./models/xdeepfm/encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)

    # 스칼라 컬럼 인코딩
    user_encoder = encoders['user_encoder']
    try:
        encoded_user_id = int(user_encoder.transform([user_id])[0])
    except Exception as e:
        print("유저 id 랜덤")
        query_list = get_query_data(user_id)
        return query_list
        # raise ValueError(f"입력받은 user_id({user_id}) 인코딩 오류: {e}")

    try:
        encoded_like_region1 = int(encoders['like_region1_encoder'].transform([like_region1])[0])
        encoded_like_region2 = int(encoders['like_region2_encoder'].transform([like_region2])[0])
        encoded_like_region3 = int(encoders['like_region3_encoder'].transform([like_region3])[0])
        encoded_like_genre1 = int(encoders['like_genre1_encoder'].transform([like_genre1])[0])
        encoded_like_genre2 = int(encoders['like_genre2_encoder'].transform([like_genre2])[0])
        encoded_like_genre3 = int(encoders['like_genre3_encoder'].transform([like_genre3])[0])
    except Exception as e:
        print("유저 like 랜덤")
        query_list = get_query_data(user_id)
        return query_list
        # raise ValueError(f"입력받은 선호 정보(지역/장르) 인코딩 오류: {e}")

    # 게시글 스칼라 컬럼 인코딩
    post_encoder = encoders['post_encoder']
    post_data['post_id_enc'] = post_encoder.transform(post_data['post_id'])

    # === 다중 값 컬럼(게시글 제목, 지역, 장르)을 모두 사용 ===
    post_data['post_title_list'] = post_data['title'].apply(lambda x: [t.strip() for t in x.split(',')])
    post_data['post_region_list'] = post_data['region'].apply(lambda x: [t.strip() for t in x.split(',')])
    post_data['post_genre_list'] = post_data['genres'].apply(lambda x: [t.strip() for t in x.split(',')])

    # 학습 시 저장한 매핑과 최대 길이 정보 로드
    title_mapping = encoders['title_mapping']
    region_mapping = encoders['region_mapping']
    genre_mapping = encoders['genre_mapping']
    max_title_len = encoders['max_title_len']
    max_region_len = encoders['max_region_len']
    max_genre_len = encoders['max_genre_len']

    # 각 리스트를 인코딩 (알 수 없는 토큰은 0 처리)
    post_data['post_title_enc_list'] = post_data['post_title_list'].apply(lambda lst: [title_mapping.get(t, 0) for t in lst])
    post_data['post_region_enc_list'] = post_data['post_region_list'].apply(lambda lst: [region_mapping.get(t, 0) for t in lst])
    post_data['post_genre_enc_list'] = post_data['post_genre_list'].apply(lambda lst: [genre_mapping.get(t, 0) for t in lst])

    # 시퀀스 패딩
    title_padded = pad_sequences(post_data['post_title_enc_list'].tolist(), maxlen=max_title_len, padding='post')
    region_padded = pad_sequences(post_data['post_region_enc_list'].tolist(), maxlen=max_region_len, padding='post')
    genre_padded = pad_sequences(post_data['post_genre_enc_list'].tolist(), maxlen=max_genre_len, padding='post')

    # 추천에 필요한 입력 데이터 구성 (게시글 건수 만큼 반복)
    num_posts = len(post_data)
    inference_input = {
        'user_id_enc': np.full((num_posts, 1), encoded_user_id),
        'like_region1_enc': np.full((num_posts, 1), encoded_like_region1),
        'like_region2_enc': np.full((num_posts, 1), encoded_like_region2),
        'like_region3_enc': np.full((num_posts, 1), encoded_like_region3),
        'like_genre1_enc': np.full((num_posts, 1), encoded_like_genre1),
        'like_genre2_enc': np.full((num_posts, 1), encoded_like_genre2),
        'like_genre3_enc': np.full((num_posts, 1), encoded_like_genre3),
        'post_id_enc': post_data['post_id_enc'].values.reshape(-1, 1),
        'post_title_seq': title_padded,
        'post_region_seq': region_padded,
        'post_genre_seq': genre_padded
    }

    predictions = dependencies.xdeepfm.predict(inference_input).flatten()

    posts_with_predictions = post_data.copy()
    posts_with_predictions['predicted_like'] = predictions

    # 후처리: 이미 사용자가 좋아요한 게시글, 또는 사용자가 작성한 게시글 제외
    liked_post_ids = interaction_data[(interaction_data['user_id'] == user_id) & (interaction_data['liked'] == 1)]['post_id'].unique()
    filtered_posts = posts_with_predictions[~posts_with_predictions['post_id'].isin(liked_post_ids)]
    filtered_posts = filtered_posts[filtered_posts['author'] != user_id]

    recommended_posts = filtered_posts.sort_values('predicted_like', ascending=False).head(top_n)
    return list(recommended_posts['post_id'])
    # return recommended_posts[['post_id', 'title', 'predicted_like']].to_dict(orient='records')