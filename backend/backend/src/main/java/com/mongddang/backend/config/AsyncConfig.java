package com.mongddang.backend.config;

import java.util.concurrent.Executor;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync // 비동기 처리를 활성화합니다.
public class AsyncConfig implements AsyncConfigurer {
	@Override
	@Bean(name="mailExecutor")
	public Executor getAsyncExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		
		executor.setCorePoolSize(2);
        // 최대 스레드 수: 작업량 증가 시 최대 생성 가능한 스레드 수
        executor.setMaxPoolSize(5);
        // 작업 대기 큐의 용량
        executor.setQueueCapacity(10);
        // 스레드 이름에 붙을 접두사 설정 (로그 확인 시 유용)
        executor.setThreadNamePrefix("Async MailExecutor-");
        executor.initialize();
        return executor;
	}
	

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        // 비동기 작업 실행 중 발생한 예외 처리 (필요에 따라 커스터마이징 가능)
        return AsyncConfigurer.super.getAsyncUncaughtExceptionHandler();
    }

}
