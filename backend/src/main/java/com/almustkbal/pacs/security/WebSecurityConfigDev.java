package com.almustkbal.pacs.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@Profile("dev")
@Order(98)
public class WebSecurityConfigDev extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and().csrf().disable();
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		/**
		 * Security is disabled to this public access areas We have to consider the need
		 * to protect the swagger api doc in the public areas.
		 */

		web.ignoring().antMatchers("/ext/confirm-reset").antMatchers("/ext/**").antMatchers("/h2-console/**")
				.antMatchers("/webjars/**").antMatchers("/swagger-ui.html").antMatchers("/swagger-resources")
				.antMatchers("/swagger-resources/**").antMatchers("/public/**").antMatchers("/v2/**");

	}

}
