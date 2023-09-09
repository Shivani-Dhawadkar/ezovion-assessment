import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableArrayService } from '../../services/table-array.service';
import { CustomRegex } from '../../const/validators/customRegex'
import { SnackbarService } from '../../services/snackbar.service';
import { Product } from "../../const/model/interface";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  isUnchanged: boolean = true
  newForm!: FormGroup


  constructor(private _arrayService: TableArrayService,
    private _snackBar: SnackbarService) { }
  // userArr : Array<any> = this._arrayService.userArray;
  detailsArr!: Product[];
  addArray!: Array<Product>
  productId!: any
  ngOnInit(): void {



    this._arrayService.getAllDetails()
      .subscribe((res) => {
        this.detailsArr = res
        console.log(this.detailsArr);
      })


    this.newForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      product: new FormControl(null, [Validators.required, Validators.pattern(CustomRegex.username)]),
      category: new FormControl(null, [Validators.required]),
      fullPrice: new FormControl(null, [Validators.required]),
      SalePrice: new FormControl(null, [Validators.required]),
      avaibility: new FormControl(null, [Validators.required]),
      supplier: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
    })

  }

  onSubmitForm(form: FormGroup) {
    let newObj = {
      id: form.value.id,
      product: form.value.product,
      category: form.value.category,
      fullPrice: form.value.fullPrice,
      SalePrice: form.value.SalePrice,
      avaibility: form.value.avaibility,
      supplier: form.value.supplier,
      discount: form.value.discount + '%',
      IsaddProduct: false,
      isEdit: false
    }
    if (form.valid) {
      console.log(form.value);
      this._arrayService.postDetails(newObj)
        .subscribe(resp => {
          console.log(resp);

        })
    }


  }

  onAddProduct() {
    this.detailsArr.unshift(
      {
        id: 0,
        product: '',
        category: '',
        fullPrice: 0,
        SalePrice: 0,
        avaibility: true,
        supplier: '',
        discount: '',
        IsaddProduct: true,
        isEdit: true

      }
    )

  }

  OnEdit(obj: Product) {
    // debugger;
    this.detailsArr.forEach((element: any) => {
      element.isEdit = false;
    });
    obj.isEdit = true;


  }
  // OnAdd(obj : any){
  //   this._arrayService.postDetails(obj)
  //   .subscribe(resp=>{
  //     console.log(resp);  
  //     resp.IsaddProduct =false
  //     resp.isEdit = false
  //   })

  //   obj.IsaddProduct = false;
  //   obj.isEdit = false

  // }

  OnUpdate(obj: Product, id: any) {
    console.log(obj);
    let newObj = {
      id: obj.id,
      product: obj.product,
      category: obj.category,
      fullPrice: obj.fullPrice,
      SalePrice: obj.SalePrice,
      avaibility: obj.avaibility,
      supplier: obj.supplier,
      discount: obj.discount + '%',
      IsaddProduct: false,
      isEdit: false
    }

    obj.isEdit = false
    newObj.isEdit = false

    if (obj.IsaddProduct == true) {
      obj.isEdit = false
      obj.IsaddProduct = false
      newObj.isEdit = false;
      newObj.IsaddProduct = false

      if (!this.newForm.valid) {
        this._snackBar.openSnackBar('Please enter required information before submit', "close")
      }
    }
    if (this.newForm.valid) {
      this._arrayService.postDetails(newObj)
        .subscribe(resp => {
          console.log({ ...resp });
          this._snackBar.openSnackBar('Your details are submitted successfully', "close")
        })


    } else {
      this._arrayService.updateDetails(id, obj)
        .subscribe(resp => {
          console.log(resp);

          this._snackBar.openSnackBar('Your details are updated successfully', "close")

        })
    }




  }

  onDelete(obj: Product) {
    console.log(obj);
    console.log(obj.id);

    this._arrayService.deleteDetails(obj.id)


      .subscribe(() => {
        this.detailsArr.filter((item: any) => { item.id !== obj.id })
        // console.log(this.productId);  


      })
    obj.isEdit = false
    this._snackBar.openSnackBar('Your details are deleted successfully', "close")
  }

  onArrowClick() {
    this.detailsArr.reverse()

  }

  onArrowSort(){
    this.detailsArr.sort((a:Product,b:Product)=>{
      let x = a.id
      let y = b.id
     return x>y ? 1 : -1
    })
  }

  // this.detailsArr.reverse()

}
