## fastAPI 서버 실행
---

```
# cwd: fast-api
uvicorn app.main:app --reload
```




## 종속성
---

### 방법 1. Conda 가상환경 생성
```
conda env create -f environment.yml
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### 방법 2. pip requirements 설치
```
pip install -r requirements.txt
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```