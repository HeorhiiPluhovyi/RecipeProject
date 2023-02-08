import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RecipeListService } from 'src/app/services/recipe-list.service';
import { Ingredient } from 'src/app/shared/ingredient.module';
import { Recipe } from 'src/app/shared/recipe.module';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  editMode: boolean = false;
  recipeEditForm: FormGroup;
  private subscription: Subscription;
  private id: number;

  constructor(
    private route: ActivatedRoute,
    private recipes: RecipeListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.route
      .params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];

          this.editMode = params['id'] != null;
        }
      );

    this.initForm();
  }

  private initForm(): void {
    let name: string = '';
    let imgPath: string = '';
    let description: string = '';
    let ingredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipes.getRecipeById(this.id);
      name = recipe.name;
      imgPath = recipe.imgPath;
      description = recipe.description;

      for (let ingredient of recipe.ingredients) {
        ingredients.push(
          new FormGroup({
            name: new FormControl(ingredient.name),
            amount: new FormControl(ingredient.amount)
          })
        )
      }
    }

    this.recipeEditForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      imgPath: new FormControl(imgPath, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients: ingredients
    })
  }

  get ingredientsControl(): FormArray {
    return this.recipeEditForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredientsControl.push(
      new FormGroup({
        name: new FormControl('', Validators.required),
        amount: new FormControl(
          null,
          [
            Validators.required,
            Validators.pattern(/^[0-9]+[0-9]*$/)
          ])
      })
    );
  }

  onSubmit(): void {
    const recipe = new Recipe(
      this.recipeEditForm.value.name,
      this.recipeEditForm.value.description,
      this.recipeEditForm.value.imgPath,
      this.recipeEditForm.value.ingredients
    );

    if (this.editMode) {
      this.recipes.changeRecipe(recipe, this.id);
    }

    if (!this.editMode) {
      this.recipes.addNewRecipe(recipe);
      console.log('gggggg')
    }

    this.recipeEditForm.reset();
    this.onCancel();
  }

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(i: number): void {
    this.ingredientsControl.removeAt(i);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
