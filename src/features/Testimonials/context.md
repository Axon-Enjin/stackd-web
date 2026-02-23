import { Certification, CertificationUpdateDTO } from "./domain/Certification";

import { CreateCertificationUseCase } from "./useCases/CreateCertificationUseCase";

import { DeleteCertificationUseCase } from "./useCases/DeleteCertificationUseCase";

import { GetOneCertificationUseCase } from "./useCases/GetOneCertificationUseCase";

import { ListCertifications } from "./useCases/ListCertifications";

import { UpdateCertificationUseCase } from "./useCases/UpdateCertificationUseCase";



export class CertificationsModuleController {

  constructor(

    private createCertificationUseCase: CreateCertificationUseCase,

    private deleteCertificationUseCase: DeleteCertificationUseCase,

    private listCertificationsUseCase: ListCertifications,

    private updateCertificationUseCase: UpdateCertificationUseCase,

    private getOneCertificationUseCase: GetOneCertificationUseCase

  ) {}



  /**

   * Helper method to map the Domain Entity to a plain object

   */

  private mapCertificationToResponse(certification: Certification) {

    return {

      id: certification.props.id,

      imageUrl: certification.props.image_url,

      firstName: certification.props.title,

      lastName: certification.props.description,

      rankingIndex: certification.props.rankingIndex,

    };

  }



  async getOneCertification(certificationId: string) {

    const result = await this.getOneCertificationUseCase.execute(certificationId);

    return this.mapCertificationToResponse(result);

  }



  async createCertification(

    title: string,

    description: string,

    image: File,

  ) {

    const result = await this.createCertificationUseCase.execute(

      {

        title: title,

        description: description,  

      },

      image,

    );

    return this.mapCertificationToResponse(result);

  }



  async updateCertification(

    certificationId: string,

    certificationRequestObj: CertificationUpdateDTO,

    newImage?: File,

  ) {

    const result = await this.updateCertificationUseCase.execute(

      certificationId,

      certificationRequestObj,

      newImage,

    );

    return this.mapCertificationToResponse(result);

  }



  async deleteCertification(certificationId: string) {

    const result = await this.deleteCertificationUseCase.execute(certificationId);

    return result; // returns boolean

  }



  async listCertifications(page: number, pageSize: number) {

    const result = await this.listCertificationsUseCase.execute(page, pageSize);



    return {

      list: result.list.map((certification) => this.mapCertificationToResponse(certification)),

      count: result.count,

    };

  }

}



export type CertificationProps = {

  image_url: string;

  title: string;

  description: string;



  // metadata

  id: string;

  rankingIndex: number;

};



export type CertificationCreateDTO = Omit<

  CertificationProps,

  "id" | "rankingIndex" | "image_url"

>;



export type CertificationUpdateDTO = Partial<CertificationCreateDTO>;



export class Certification {

  private _props: CertificationProps;

  private constructor(props: CertificationProps) {

    this._props = props;

  }



  get props() {

    return this._props;

  }



  static hydrate(props: CertificationProps) {

    return new Certification(props);

  }



  static create(image_url: string, props: CertificationCreateDTO) {

    return new Certification({

      ...props,

      id: crypto.randomUUID(),

      rankingIndex: Date.now(), // always returns a number higher than the last time you call it

      image_url,

    });

  }



  update(props: CertificationUpdateDTO) {

    this._props = {

      ...this._props,

      ...props,

    };

  }



  setImageUrl(imageUrl: string) {

    this._props.image_url = imageUrl;

  }

}

import { Certification } from "./Certification";



export abstract class ICertificationRepository {

  abstract saveNewCertification(certification: Certification): Promise<Certification>;

  abstract persisUpdates(certification: Certification): Promise<Certification>;

  abstract deleteById(id: string): Promise<boolean>;

  abstract findById(id: string): Promise<Certification | null>;

  abstract listPaginated(

    pageNumber: number,

    pageSize: number,

  ): Promise<{ list: Certification[]; count: number }>;

}

export abstract class IImageService {

  abstract uploadFile(file: File): Promise<string>; // takes file, returns public url of image



  abstract deleteFile(publicUrl: string): Promise<boolean>;

}

import { IImageService } from "../domain/IImageService";

import { ICertificationRepository } from "../domain/ICertificationRepository";

import { Certification, CertificationCreateDTO } from "../domain/Certification";



export class CreateCertificationUseCase {

  constructor(

    private readonly certificationRepository: ICertificationRepository,

    private readonly imageService: IImageService,

  ) {}



  async execute(certificationRequestObj: CertificationCreateDTO, image: File) {

    const imageUrl = await this.imageService.uploadFile(image);

    const newCertification = Certification.create(imageUrl, certificationRequestObj);

    await this.certificationRepository.saveNewCertification(newCertification);



    return newCertification;

  }

}

import { IImageService } from "../domain/IImageService";

import { ICertificationRepository } from "../domain/ICertificationRepository";



export class DeleteCertificationUseCase {

  constructor(

    private readonly certificationRepository: ICertificationRepository,

    private readonly imageService: IImageService,

  ) {}



  async execute(certificationId: string) {

    /**

     * get certification

     * delete certification image

     * delete certification record

     * return true

     */

    const certification = await this.certificationRepository.findById(certificationId);



    if (!certification) {

      throw new Error("Certification not found");

    }



    await this.imageService.deleteFile(certification.props.image_url);

    await this.certificationRepository.deleteById(certificationId);



    return true;

  }

}

import { ICertificationRepository } from "../domain/ICertificationRepository";



export class GetOneCertificationUseCase {

  constructor(private readonly certificationRepository: ICertificationRepository) {}



  async execute(certificationId: string) {

    const result = await this.certificationRepository.findById(certificationId);



    if (!result) {

      throw new Error("Certification not found");

    }



    return result;

  }

}

import { ICertificationRepository } from "../domain/ICertificationRepository";



export class ListCertifications {

  constructor(private readonly certificationRepository: ICertificationRepository) {}



  async execute(pageNumber: number, pageSize: number) {

    const result = await this.certificationRepository.listPaginated(

      pageNumber,

      pageSize,

    );



    return result;

  }

}

import { IImageService } from "../domain/IImageService";

import { ICertificationRepository } from "../domain/ICertificationRepository";

import { CertificationUpdateDTO } from "../domain/Certification";



export class UpdateCertificationUseCase {

  constructor(

    private readonly certificationRepository: ICertificationRepository,

    private readonly imageService: IImageService,

  ) {}



  async execute(

    certificationId: string,

    certificationRequestObj: CertificationUpdateDTO,

    newImage?: File,

  ) {

    /**

     * get certification

     * apply updates

     * check if new image is provided

     * if new image, delete old image and upload new image then replace certification image

     * persist updates

     * return updated certification

     */

    const certification =

      await this.certificationRepository.findById(certificationId);



    if (!certification) {

      throw new Error("Certification not found");

    }



    certification.update(certificationRequestObj);



    if (newImage) {

      await this.imageService.deleteFile(certification.props.image_url);

      const imageUrl = await this.imageService.uploadFile(newImage);

      certification.setImageUrl(imageUrl);

    }



    await this.certificationRepository.persisUpdates(certification);



    return certification;

  }

}

import { CertificationsModuleController } from "./CertificationsModuleController";

import { CertificationRepository } from "./infrastructure/CertificationRepository";

import { ImageService } from "./infrastructure/ImageService"; // Assuming this is your implementation

import { CreateCertificationUseCase } from "./useCases/CreateCertificationUseCase";

import { DeleteCertificationUseCase } from "./useCases/DeleteCertificationUseCase";

import { ListCertifications } from "./useCases/ListCertifications";

import { UpdateCertificationUseCase } from "./useCases/UpdateCertificationUseCase";

import { filesModuleController } from "@/features/FileSystem/FileSystemModule";

import { GetOneCertificationUseCase } from "./useCases/GetOneCertificationUseCase";



/**

 * 1. Infrastructure Dependencies

 * These are the low-level implementations (Supabase, Cloud Storage, etc.)

 */

const certificationRepository = new CertificationRepository();

const imageService = new ImageService(filesModuleController);



/**

 * 2. Use Cases

 * Injecting the repository and service into the business logic layer

 */

export const createCertificationUseCase = new CreateCertificationUseCase(

  certificationRepository,

  imageService,

);



export const deleteCertificationUseCase = new DeleteCertificationUseCase(

  certificationRepository,

  imageService,

);



export const listCertificationsUseCase = new ListCertifications(

  certificationRepository,

);



export const updateCertificationUseCase = new UpdateCertificationUseCase(

  certificationRepository,

  imageService,

);



export const getOneCertificationUseCase = new GetOneCertificationUseCase(

  certificationRepository,

);



/**

 * 3. Exporting Default Controller

 * The controller serves as the public API for this module

 */

export const certificationsModuleController =

  new CertificationsModuleController(

    createCertificationUseCase,

    deleteCertificationUseCase,

    listCertificationsUseCase,

    updateCertificationUseCase,

    getOneCertificationUseCase,

  );



// Exporting the class type for type-safety in other modules

export * from "./CertificationsModuleController";

