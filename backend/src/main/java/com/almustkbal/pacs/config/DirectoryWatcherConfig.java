
package com.almustkbal.pacs.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DirectoryWatcherConfig {
	private boolean enabled;
	private String directoryPath;
	private boolean indexZipFilesEnabled;
//	private boolean saveThumbnailEnabled;
}
