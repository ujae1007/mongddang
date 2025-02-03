package com.mongddang.backend.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan(basePackages = {
		"com.mongddang.backend.user.repository",
		"com.mongddang.backend.email.repository",
		"com.mongddang.backend.follow.repository",
		"com.mongddang.backend.comment.repository"
})
public class DBConfig {

}
