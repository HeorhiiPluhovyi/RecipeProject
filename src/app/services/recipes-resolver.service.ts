import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStoredService } from '../shared/data-stored.service';
import { Recipe } from '../shared/recipe.module';
import { RecipeListService } from './recipe-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private dataStorageService: DataStoredService,
    private recipeService: RecipeListService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipes = this.recipeService.getRecipes();
    return recipes.length === 0
      ? this.dataStorageService.fetcRecipes()
      : recipes;
  }
}
