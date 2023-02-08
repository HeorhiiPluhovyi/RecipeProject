import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.module';

import { Recipe } from '../shared/recipe.module';
import { ShoppingListService } from './shopping-list.service';

@Injectable()
export class RecipeListService {
  recipeSelected = new Subject<Recipe>();
  recipeSelectedId = new Subject<number>();
  recipesChanged = new Subject<Recipe[]>()

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A test Recipe 1',
  //     'Test of recipe`s descr 1',
  //     'https://assets.bonappetit.com/photos/61b775620fb3fcc4cbf036c1/master/pass/20211208%20Spaghetti%20Squash%20with%20Tomato%20Sauce%20and%20Mozarella%20LEDE.jpg',
  //     [
  //       new Ingredient('tomato', 5),
  //       new Ingredient('onion', 5),
  //       new Ingredient('potato', 5),
  //     ]),
  //   new Recipe(
  //     'A test Recipe 2',
  //     'Test of recipe`s descr 2',
  //     'https://assets.bonappetit.com/photos/61b775620fb3fcc4cbf036c1/master/pass/20211208%20Spaghetti%20Squash%20with%20Tomato%20Sauce%20and%20Mozarella%20LEDE.jpg',
  //     [
  //       new Ingredient('tomato', 5),
  //       new Ingredient('onion', 5),
  //       new Ingredient('potato', 5),
  //     ])
  // ];

  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService) {

  }

  getRecipes(): Recipe[] {
    return [ ...this.recipes ];
  }

  getRecipeById(index: number): Recipe {
    return { ...this.recipes[index] };
  }

  changeRecipe(recipe: Recipe, index: number): void {
    this.recipes[index] = recipe;
    this.nextRecipe();
  }

  addNewRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.nextRecipe();
  }

  addIngredienceToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.nextRecipe();
  }

  private nextRecipe(): void {
    this.recipesChanged.next([ ...this.recipes ]);
  }

  setRecipe(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.nextRecipe();
  }
}
