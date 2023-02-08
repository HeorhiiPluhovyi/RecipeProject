import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.module';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  ingredientForm = this.fb.group({
    ingredientName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        this.cv.isNotNumers
      ]
    ],
    ingredientAmount: [
      0,
      [
        Validators.required,
        this.cv.isNegativeNumber
      ]
    ]
  })

  subscription: Subscription;
  editedItem: Ingredient;
  editedItemMode: number;
  editMode = false;

  constructor(
    private ingredientsList: ShoppingListService,
    private fb: FormBuilder,
    private cv: CustomValidatorsService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.subscription = this.ingredientsList
      .sharedEdit
      .subscribe((i: number) => {
        this.editedItemMode = i;
        this.editedItem = this.ingredientsList.getIngredient(i);
        this.editMode = true;
        this.ingredientForm.setValue({
          ingredientName: this.editedItem.name,
          ingredientAmount: this.editedItem.amount
        });

      this.router.navigate([i, 'edit'], {relativeTo: this.route})
    })
  }

  onAddItem() {
    this.ingredientsList
      .onAdd(
        this.ingredientForm.value.ingredientName,
        this.ingredientForm.value.ingredientAmount
      )
  }

  onSubmit() {
    if (!this.editMode) {
      this.onAddItem();
    } else {
      this.editedItem.name = this.ingredientForm.value.ingredientName
      this.editedItem.amount = this.ingredientForm.value.ingredientAmount
    }

    this.onClear();
  }

  onClear() {
    this.ingredientForm.setValue({
      ingredientAmount: 0,
      ingredientName: ''
    });

    this.editMode = false;
    this.router.navigate(['shopping-list']);
  }

  onDelete() {
    this.ingredientsList.onDelete(this.editedItemMode);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
