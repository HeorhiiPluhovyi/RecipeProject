import { Ingredient } from "./ingredient.module";

export class Recipe {
  public name: string;
  public description: string;
  public imgPath: string;
  public ingredients: Ingredient[];

  constructor(
    name: string,
    description: string,
    imgPath: string,
    ingredients: Ingredient[]
  ) {
    this.name = name;
    this.description = description;
    this.imgPath = imgPath;
    this.ingredients = ingredients;
  }
}
