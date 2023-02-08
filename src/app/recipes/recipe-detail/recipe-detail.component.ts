import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RecipeListService } from 'src/app/services/recipe-list.service';
import { Recipe } from '../../shared/recipe.module';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  private id: number;
  private subscription: Subscription;

  constructor(
    private recipeListService: RecipeListService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];

          this.recipe = this.recipeListService.getRecipeById(this.id);
        }
      )
  }

  toShoppingList(): void {
    this.router.navigate(['shopping-list']);
  }

  onEdit(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDelete(): void {
    this.router.navigate(['../']);
    this.recipeListService.deleteRecipe(this.id);
    this.subscription.unsubscribe();
  }
}
