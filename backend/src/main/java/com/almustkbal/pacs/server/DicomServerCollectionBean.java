package com.almustkbal.pacs.server;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.almustkbal.pacs.domain.ApplicationEntity;

@Component
public class DicomServerCollectionBean {
	
	private Map<String, DicomServer> dicomServers = new HashMap<>();

	public  void add(String desc, DicomServer dicomServer) {
		dicomServers.put(desc, dicomServer);
	}
	
	public void terminateAE(ApplicationEntity applicationEntity) {
		for (Map.Entry<String, DicomServer> entry : dicomServers.entrySet()) {
			
			DicomServer server = entry.getValue();
			if(server.getConn().getPort() == applicationEntity.getPort() && server.getConn().getHostname() == applicationEntity.getHostname() && server.getAe().getAETitle().equals(applicationEntity.getTitle())) {
				server.getDevice().unbindConnections();
				dicomServers.remove(entry.getKey());
			}

		}
	}
	public void terminateAll() {
		System.out.println("\n\n\n size == "+ dicomServers.size());
		for (Map.Entry<String, DicomServer> entry : dicomServers.entrySet()) {
			entry.getValue().getDevice().unbindConnections();

		}
	}
	public Map<String, DicomServer> getDicomServers() {
		return dicomServers;
	}

	public void setDicomServers(Map<String, DicomServer> dicomServers) {
		this.dicomServers = dicomServers;
	}
}
