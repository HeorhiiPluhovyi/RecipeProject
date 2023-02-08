import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, Observable, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RecipeListService } from '../services/recipe-list.service';

import { Recipe } from './recipe.module';

@Injectable({
  providedIn: 'root'
})
export class DataStoredService {

  constructor(
    private http: HttpClient,
    private recipeService: RecipeListService,
    private authService: AuthService
  ) { }

  storeRecipes(): void {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    this.http.put(
      'https://ricipeproject-default-rtdb.firebaseio.com/recipe.json',
      recipes)
      .subscribe((response) => {
        console.log('Success storeRecipes!')
      })
  }

  fetcRecipes(): Observable<Recipe[]> {
    return this.authService.user
      .pipe(
        take(1),
        exhaustMap(user => {
          return this.http
            .get<Recipe[]>(
              'https://ricipeproject-default-rtdb.firebaseio.com/recipe.json',
              {
                params: new HttpParams().set('auth', user.token)
              }
            );
        }),
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          })
        }),
        tap(recipes => {
          this.recipeService.setRecipe(recipes)
        })
      )
  }
}
