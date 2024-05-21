export function generateNftMetadata(imageName: string,description:string,  imageUrl: string): any {
    return {
      name: imageName,
      description: description,
      image: imageUrl,
    };
  }