package com.almustkbal.pacs.events;

import java.io.File;
import java.io.Serializable;

public class NewDicomEvent implements Serializable{

	private static final long serialVersionUID = 8244229216737621902L;

	public NewDicomEvent(File file){
		this.file = file;
	}
	
	private final File file;

	public File getFile() {
		return file;
	}
}
