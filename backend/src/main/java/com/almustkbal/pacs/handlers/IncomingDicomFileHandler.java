package com.almustkbal.pacs.handlers;

import java.io.File;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.almustkbal.pacs.components.ActiveDicoms;
import com.almustkbal.pacs.events.NewDicomEvent;
import com.almustkbal.pacs.server.DicomReader;
import com.almustkbal.pacs.services.DicomService;
import com.google.common.eventbus.AllowConcurrentEvents;
import com.google.common.eventbus.EventBus;
import com.google.common.eventbus.Subscribe;



public class IncomingDicomFileHandler {
	
	private static final Logger LOG = LoggerFactory.getLogger(IncomingDicomFileHandler.class);
		
	@Autowired(required = true)
	private EventBus eventBus;
	
	@Autowired
	private DicomService dicomService;
	
	@Autowired
	private ActiveDicoms activeDicoms;
		
	@Transactional
	@Subscribe
    @AllowConcurrentEvents
    public void handleIncomingFileEvent(NewDicomEvent newDicomEvent) {
    	//IMPORTANT! Write everything inside try catch, the guava breaks if an exception occurs
		
		try{
			
			// check if still windows on file.
			int tryCount = 1;
			while(!newDicomEvent.getFile().renameTo(newDicomEvent.getFile())) {
		        // Cannot read from file, windows still working on it.
				if(tryCount == 10) {
					break;
				}
				Thread.sleep(10);
		    }
			
			File file = newDicomEvent.getFile();//get the file from event handler
			DicomReader reader = new DicomReader(file);			
			
			LOG.info("Active Dicoms:{} Received Patient Name:{} ID:{} Age:{} Sex:{} ", activeDicoms.toString(), reader.getPatientName(), reader.getPatientID(), reader.getPatientAge(), reader.getPatientSex());
			synchronized(dicomService){
				dicomService.buildEntities(reader, true);//lets build our dicom database entities
			}
			
			
		}catch(Exception e){
			LOG.error(e.getMessage(),e);
		}
	}
	
	@PostConstruct
    public void postConstruct(){
        eventBus.register(this);       
    }

    @PreDestroy
    public void preDestroy(){
        eventBus.unregister(this);
    }
	
	public void printStats(String status) {
		//String str = Thread.currentThread().getName().split("@@")[0];
		//Thread.currentThread().setName(String.valueOf(Thread.currentThread().getId()));		
		LOG.info("{} {} {} [Active Threads: {}] ",Thread.currentThread().getId(), Thread.currentThread().getName(), status, Thread.activeCount());		
		
	}
}
