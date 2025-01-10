import { CreateTTDTO } from "../../infrastructure/dtos/CreateTTDTO";
import { MetadataExtractorService } from "../../infrastructure/services/MetadataExtractorService";



export class ExtractMetadataUseCase{
    constructor(
        private readonly metadataExtractorService:MetadataExtractorService
    ){}
    public async execute(fileBuffer:Buffer){
        if(!fileBuffer){
            throw new Error("No hay pdf quek")
        }
        let metadata :CreateTTDTO= await this.metadataExtractorService.generarMetadata(fileBuffer);
        return metadata
    }
}