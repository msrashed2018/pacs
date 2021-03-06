package com.almustkbal.pacs.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;

@Configuration
@EnableAuthorizationServer
public class OAuth2AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private DataSource dataSource;

	@Autowired
	private UserDetailsService userService;

	@Value("${oauth.clientId:khedma-client}")
	private String clientId;

	@Value("${oauth.client-secret:secretvalue}")
	private String clientSecret;

	@Value("${oauth.authorizedGrantTypes:password,authorization_code,refresh_token}")
	private String[] authorizedGrantTypes;

	@Value("${oauth.token.access.expiration:43200}") // 12 hours
	private int accessTokenValiditySeconds;

	@Value("${oauth.token.refresh.expiration:2592000}") // 30 days
	private int refreshTokenValiditySeconds;

	@Override
	public void configure(final AuthorizationServerSecurityConfigurer oauthServer) throws Exception {

		/*
		 * Spring Security OAuth exposes two endpoints for checking tokens
		 * (/oauth/check_token and /oauth/token_key). Those endpoints are not exposed by
		 * default (have access "denyAll()"). you can change it by do the below config
		 */

//		oauthServer.tokenKeyAccess("permitAll()").checkTokenAccess("isAuthenticated()");

		/*
		 * The tokenKeyAccess() configures access for the endpoint exposing the public
		 * key used for signing JWT tokens. The checkTokenAccess() configures access for
		 * the endpoint used to decode access tokens.
		 */
	}

	@Override
	public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
		clients.inMemory().withClient(clientId).secret(passwordEncoder.encode(clientSecret))
				.accessTokenValiditySeconds(accessTokenValiditySeconds)
				.refreshTokenValiditySeconds(refreshTokenValiditySeconds).authorizedGrantTypes(authorizedGrantTypes)
				.scopes("read", "write").resourceIds("api");
	}

	@Override
	public void configure(final AuthorizationServerEndpointsConfigurer endpoints) {

		// create the token enhancer!
//		TokenEnhancerChain tokenEnhancerChain = new TokenEnhancerChain();
//		tokenEnhancerChain.setTokenEnhancers(Arrays.asList(tokenEnhancer(), accessTokenConverter()));
//        endpoints.tokenStore(jdbcTokenStore()); // saves tokens in DB
		endpoints.tokenStore(tokenStore()); // doesn't save tokens
//		endpoints.accessTokenConverter(accessTokenConverter()).userDetailsService(userService);
		endpoints.authenticationManager(authenticationManager);
		endpoints.userDetailsService(userService);
		// attach the token enhancer!
//		endpoints.tokenEnhancer(tokenEnhancerChain);

//		endpoints.accessTokenConverter(accessTokenConverter()).userDetailsService(userService)
//				.authenticationManager(authenticationManager);

//		endpoints.tokenGranter(this.tokenGranter(endpoints));
	}

//	@Bean
//	public TokenGranter tokenGranter(AuthorizationServerEndpointsConfigurer endpoints) {
//
//		List<TokenGranter> ltg = new LinkedList<TokenGranter>();
//		ltg.add(new LoginTokenGranter(authenticationManager, tokenServices(), endpoints.getClientDetailsService(),
//				endpoints.getOAuth2RequestFactory()));
//		CompositeTokenGranter ctg = new CompositeTokenGranter(ltg);
//		return ctg;
//	}
//
	@Bean
	@Primary
	public DefaultTokenServices tokenServices() {
		final DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
		defaultTokenServices.setTokenStore(tokenStore());
		defaultTokenServices.setSupportRefreshToken(true);
//		defaultTokenServices.setTokenEnhancer(tokenEnhancer());
		defaultTokenServices.setAccessTokenValiditySeconds(accessTokenValiditySeconds);
		defaultTokenServices.setRefreshTokenValiditySeconds(refreshTokenValiditySeconds);
		return defaultTokenServices;
	}

	@Bean
	public TokenStore tokenStore() {
//		return new JwtTokenStore(accessTokenConverter());
		return new JdbcTokenStore(dataSource);
	}

//	@Bean
//	JwtAccessTokenConverter accessTokenConverter() {
//		CustomJwtAccessTokenConverter converter = new CustomJwtAccessTokenConverter();
//		converter.setSigningKey(jwtSigningKey);
//		return converter;
//	}

	// TOKEN ENHANCER THAT ENABLES USER TO CARRY SOME DATA
//	@Bean
//	public TokenEnhancer tokenEnhancer() {
//		return new CustomTokenEnhancer();
//	}
}
