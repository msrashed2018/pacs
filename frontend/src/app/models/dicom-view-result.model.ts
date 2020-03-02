import { Tag } from './tag.model';
import { Patient } from './patient.model';
import { Study } from './study.model';
import { Series } from './series.model';
import { Equipment } from './equipment.model';
import { Instance } from './instance.model';

export class DicomViewResult {
    patient: Patient;
    study: Study;
    series: Series;
    equipment: Equipment;
    instance: Instance;
    allTags: Tag[]
}
