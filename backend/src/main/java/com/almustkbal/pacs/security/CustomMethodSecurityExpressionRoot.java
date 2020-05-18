package com.almustkbal.pacs.security;

import java.util.Set;

import org.springframework.security.access.expression.SecurityExpressionRoot;
import org.springframework.security.access.expression.method.MethodSecurityExpressionOperations;
import org.springframework.security.core.Authentication;

import com.almustkbal.pacs.domain.Privilege;
import com.almustkbal.pacs.domain.User;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomMethodSecurityExpressionRoot extends SecurityExpressionRoot
		implements MethodSecurityExpressionOperations {

	public CustomMethodSecurityExpressionRoot(Authentication authentication) {
		super(authentication);
	}

	public boolean hasPrivilege(String requiredPrivilege) {
		Object principal = authentication.getPrincipal();
		if (principal instanceof User) {
			Set<Privilege> privileges = ((User) principal).getPrivileges();
			for (Privilege privilege : privileges) {
				if (privilege.getName().toString().equals(requiredPrivilege)) {
					return true;
				}
			}
		}

		return false;
	}

	@Override
	public void setFilterObject(Object filterObject) {
		// TODO Auto-generated method stub

	}

	@Override
	public Object getFilterObject() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setReturnObject(Object returnObject) {
		// TODO Auto-generated method stub

	}

	@Override
	public Object getReturnObject() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object getThis() {
		// TODO Auto-generated method stub
		return null;
	}

}
