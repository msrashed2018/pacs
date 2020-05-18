package com.almustkbal.pacs.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(authenticationProvider());
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
	}

	@Bean
	public CustomAuthenticationProvider authenticationProvider() {
		CustomAuthenticationProvider provider = new CustomAuthenticationProvider();
//		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setPasswordEncoder(passwordEncoder);
		provider.setUserDetailsService(userDetailsService);
		return provider;
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
//		http.requiresChannel().anyRequest().requiresSecure();
		http.headers().cacheControl().disable().and().anonymous().disable().sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests().anyRequest()
				.authenticated().and().csrf().disable();
//				.exceptionHandling()
//				.authenticationEntryPoint(customAuthenticationEntryPoint);
//				.accessDeniedHandler(new CustomAccessDeniedHandler());

	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		/**
		 * Security is disabled to this public access areas We have to consider the need
		 * to protect the swagger api doc in the public areas.
		 */

		web.ignoring().antMatchers("/images/**").antMatchers("/registeration/user").antMatchers("/ext/**")
				.antMatchers("/h2-console/**").antMatchers("/webjars/**").antMatchers("/swagger-ui.html")
				.antMatchers("/swagger-resources").antMatchers("/swagger-resources/**").antMatchers("/public/**")
				.antMatchers("/v2/**");

	}

}
