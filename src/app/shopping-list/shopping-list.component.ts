import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ShoppingListService } from '../services/shopping-list.service';
import { Ingredient } from '../shared/ingredient.module';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Ingredient[];
  subscription: Subscription;

  constructor(
    private ingredientsList: ShoppingListService
  ) { }

  ngOnInit(): void {
    this.ingredients = this.ingredientsList.getIngredientsList();

    this.subscription = this.ingredientsList.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
  }

  onEdit(index: number): void {
    this.ingredientsList.sharedEdit.next(index)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
