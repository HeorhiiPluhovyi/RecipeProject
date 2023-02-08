import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeListService } from 'src/app/services/recipe-list.service';
import { Recipe } from '../../shared/recipe.module';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  private subscription: Subscription;

  constructor(
    private recipeListService: RecipeListService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.recipeListService.recipesChanged.subscribe(
      (changedRecipe: Recipe[]) => {
        this.recipes = changedRecipe;
      }
    )

    this.recipes = this.recipeListService.getRecipes();
  }

  onNewRecipe(): void {
    this.router.navigate(['new'], {relativeTo: this.route})
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
