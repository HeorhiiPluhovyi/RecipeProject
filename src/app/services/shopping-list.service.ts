import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.module';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  sharedEdit = new Subject<number>()

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 15),
    new Ingredient('Lemon', 1),
    new Ingredient('Meat', 15),
    new Ingredient('apple', 4)
  ];

  getIngredientsList() {
    return [ ...this.ingredients ];
  }

  getIngredient(index) {
    return this.ingredients[index];
  }

  onAdd(name: string, amount: number): void {
    this.ingredients.push(new Ingredient(name, amount));

    this.ingredientsChanged.next([ ...this.ingredients ])
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push( ...ingredients );
    this.ingredientsChanged.next([ ...this.ingredients ]);
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next([ ...this.ingredients ])
  }

  onDelete(index: number): void {
    this.ingredients.splice(index, 1);

    console.log(this.ingredients)

    this.ingredientsChanged.next([ ...this.ingredients ]);
  }

  onClear(): void {

  }
}
