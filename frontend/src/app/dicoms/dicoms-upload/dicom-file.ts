import { DicomViewResult } from 'app/models/dicom-view-result.model';

export class DicomFile {
  index: number;
  fileName: string;
  dicom: DicomViewResult;
}
