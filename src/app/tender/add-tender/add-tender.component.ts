import { AfterViewInit, Component, ElementRef, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';
import { MouseEvent, MapsAPILoader, AgmMap } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-tender',
  templateUrl: './add-tender.component.html',
  styleUrls: ['./add-tender.component.css']
})

export class AddTenderComponent implements OnInit, AfterViewInit {
  tenderForm!: FormGroup
  countryDropdownArray = new Array();
  ministryDropdownArray = new Array();
  zoneDropdownArray = new Array();
  stateDropdownArray = new Array();
  distDivisionDropdownArray = new Array();
  categoryDropdownArray = new Array();
  expertiseAreaArray = new Array();
  govtBodyArray = new Array();
  districtDeopdownArray = new Array();
  minDate = new Date();
  zoom: number = 12;
  lat: number = 18.5204303;
  lng: number = 73.8567437;


  rfpType: string = 'Document';
  imgName: string = '';
  pdfName: string = '';
  profileImg: any
  showPDF: any;
  tenderId: any
  editFlag: boolean = false;
  patchFlag: boolean = false;
  editObj: any;
  editTenderId: any
  bookletPrice: any

  @ViewChild('search', { static: true })
  public searchElementRef!: ElementRef<any>;

  @ViewChild('AgmMap') agmMap!: AgmMap;
  @ViewChild('AgmMark') agmMark!: AgmMap;

  constructor(private api: CommonServiceService, private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
    private snakBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    console.log(this.agmMap);
    // console.log(this.agmMark);

  }



  ngOnInit(): void {
    this.formData();
    this.tenderForm.controls['country'].disable();
    this.tenderForm.controls['bookletPrice'].disable();

    this.route.paramMap.subscribe((params) => {
      this.editTenderId = params.get('id');

    }
    )
    this.mapData();

    this.editTenderId ? (this.editFlag = true, this.getTenderById()) : this.editFlag = false;
    this.getGovtBody();
    this.getCountryDropdown();
    this.getCategoryDropdown();
  }




  formData() {
    this.tenderForm = this.fb.group({
      gov_TenderId: ['', Validators.required],
      country: ['3'],
      govtBody: ['', Validators.required],
      ministry: ['', Validators.required],
      state: ['', Validators.required],
      zone: ['', Validators.required],
      division_District: ['', Validators.required],
      district: ['', Validators.required],
      category: ['', Validators.required],
      expertiseArea: ['', Validators.required],
      tenderId: [''],
      tenderAmount: ['', Validators.required],
      bookletPrice: [''],
      tenderName: ['', Validators.required],
      closingDate: ['', Validators.required],
      description: ['', Validators.required],
      locationName: [''],
      latitude: [''],
      longitude: [''],
      personName: ['', Validators.required],
      designation: ['', Validators.required],
      contactNo: ['', Validators.required],
      tenderDocPath: [''],
      rfpDocLink: [''],
      tenderImagePath: [''],
      tenderPublishStatus: true,
    })

  }

  get formControls() { return this.tenderForm.controls }

  getTenderById() {
    this.api.setHttp('get', 'Tender/Management/get-tenderbyid?id=' + this.editTenderId, false, false, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200) {
          this.editObj = res.responseData;
          this.patchValue();
        }
      })
    })
  }

  //#region dropdown
  // --------------------------------------------------------Dropdown----------------------------------------------------

  getCountryDropdown() {
    this.api.setHttp('get', 'Country/Management/get-ddl-country_1_0', false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.countryDropdownArray = res.responseData;
        } else {
          this.countryDropdownArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);

      }
    })
  }

  getGovtBody() {
    this.govtBodyArray = [
      { id: '1', name: 'Center Goverment' },
      { id: '2', name: 'State Goverment' },
      { id: '3', name: 'PSU' }];
    // this.editFlag ?  this.getMinistryDropdown() : '';
    if (this.editFlag) {
      this.tenderForm.controls['ministry'].setValue(this.editObj?.ministry.id);
      this.getMinistryDropdown();
    }
    if (this.editFlag && this.tenderForm.value.govtBody != 1) {
      this.tenderForm.controls['state'].setValue(this.editObj?.state.id);
      this.getStateDropdown()
    }
  }

  getMinistryDropdown() {
    let govtId = this.tenderForm.value.govtBody
    this.api.setHttp('get', 'Ministries/Management/get-ddl-govbody_1_0?govbodyId=' + govtId + '&countryId=3', false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.ministryDropdownArray = res.responseData;
          if (!this.editFlag && govtId != 1) {
            this.getStateDropdown();
          }
          if (this.editFlag && govtId != 3) {
            this.tenderForm.controls['zone'].setValue(this.editObj?.zone.id);
            this.getZoneDropdown();
          }
        } else {
          this.ministryDropdownArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  getStateDropdown() {
    this.zoneDropdownArray = [];
    this.api.setHttp('get', 'api/StateMaster/get-ddl-state_1_0', false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.stateDropdownArray = res.responseData;
          this.editFlag ? this.getDistrictDropdown() : ''
          if (this.editFlag && this.tenderForm.value.govtBody == 3) {
            this.tenderForm.controls['district'].setValue(this.editObj?.district?.id)
          }
        } else {
          this.stateDropdownArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  getDistrictDropdown() {
    let stateId;
    if (this.tenderForm.value.govtBody == '3') {
      stateId = this.tenderForm.value.state;
    } else {
      stateId = '';
    }
    this.api.setHttp('get', 'api/DistrictMaster/get-ddl-district_1_0?stateId=' + stateId, false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.districtDeopdownArray = res.responseData;
        } else {
          if (this.tenderForm.value.govtBody == '3')
            this.snakBar.open(res.statusMessage + ' for this State', 'ok')
          setTimeout(() => {
            this.snakBar.dismiss()
          }, 3000);
          this.districtDeopdownArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  getZoneDropdown() {
    this.distDivisionDropdownArray = [];
    let ministryId = this.tenderForm.value.ministry;
    let stateId;
    if (this.tenderForm.value.govtBody != 1) {
      stateId = this.tenderForm.value.state;
    } else {
      stateId = '';
    }
    this.api.setHttp('get', 'Division/Management/get-ddl-zonename?ministryid=' + ministryId + '&countryId=3' + '&stateId=' + stateId, false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.zoneDropdownArray = res.responseData;
          if (this.editFlag && this.tenderForm.value.govtBody != 3) {
            this.tenderForm.controls['division_District'].setValue(this.editObj?.division_District?.id);
            this.getDistDivisionDropdown()
          }
        } else {
          if (this.tenderForm.value.state && this.tenderForm.value.govtBody == 2) {
            this.snakBar.open(res.statusMessage + ' this State', 'ok')
            setTimeout(() => {
              this.snakBar.dismiss()
            }, 3000);
          } else if (this.tenderForm.value.ministry && this.tenderForm.value.govtBody == 1) {
            this.snakBar.open(res.statusMessage + ' for this ministry', 'ok')
            setTimeout(() => {
              this.snakBar.dismiss()
            }, 3000);
          }
          this.zoneDropdownArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  getDistDivisionDropdown() {
    let zoneId;
    if (this.tenderForm.value.zone) {
      zoneId = this.tenderForm.value.zone;
    }
    this.api.setHttp('get', 'Division/Management/get-ddl-division_1_0?zoneId=' + zoneId, false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.distDivisionDropdownArray = res.responseData;
        } else {
          this.distDivisionDropdownArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  getCategoryDropdown() {
    this.api.setHttp('get', 'Category/Management/get-ddl-category_1_0', false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.categoryDropdownArray = res.responseData;
          if (this.editFlag) {
            this.tenderForm.controls['expertiseArea'].setValue(this.editObj?.expertiseArea.id)
            this.getExpertiseAreaDropdown();
          }
        } else {
          this.categoryDropdownArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  getExpertiseAreaDropdown() {
    let categoryId = this.tenderForm.value.category;
    this.api.setHttp('get', 'ExpertiseArea/Management/get-ddl-expertise-category_1_0?categoryId=' + categoryId, false, false, false, 'dropdownURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == '200') {
          this.expertiseAreaArray = res.responseData;
        } else {
          this.expertiseAreaArray = [];
        }
      }),
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  // ----------------------------------------------------------Dropdown--------------------------------------------------
  //#endregion

  // -------------------------------------------- - - image -  - -------------------------------------------------------

  docAndLink(name: string) {
    this.rfpType = name;
  }

  imageUpload(event: any, type: string) {
    let imageType = event.target.value.split('.')[1]
    imageType = imageType.toLowerCase();
    let file
    if (type == 'pdf') {
      if (imageType == 'pdf') {
        file = event.target.files[0];
        this.pdfName = file;
      }
    } else if (type == 'img') {
      if (imageType == 'jpg' || imageType == 'png' || imageType == 'jfif') {
        file = event.target.files[0];
        this.imgName = file;
      }
    }
    let reader1 = new FileReader();
    reader1.onload = (event: any) => {
      if (type == 'pdf') {
        this.showPDF = event.target.result
      } else {
        this.profileImg = event.target.result;
      }
    }
    reader1.readAsDataURL(file);
  }

  saveImage() {
    let formData = new FormData();
    formData.append('TenderImage', this.imgName);
    formData.append('TenderDoc', this.pdfName);
    formData.append('tenderId', this.tenderId);
    formData.append('TenderQuestionary', '');
    formData.append('modifiedby', 'USER202203041214524702060');

    this.api.setHttp('put', 'Tender/Management/uploadTenderDocument', false, formData, false, 'baseURL');
    this.api.getHttp().subscribe({
      next: ((res: any) => {
        if (res.statusCode == 200) {
        }
      })
    })
  }

  clearImg(name: string) {
    if (name == 'img') {
      this.tenderForm.controls['tenderImagePath'].setValue('')
      this.profileImg = '';
    } else {
      this.tenderForm.controls['tenderDocPath'].setValue('')
      this.showPDF = '';
    }
  }

  viewPDF() {
    window.open(this.showPDF, '_blank');
  }

  // -------------------------------------------------Image------------------------------------------------------------

  // ----------------------------------------------------map-------------------------------------------------------------

  mapData() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.tenderForm.controls['locationName'].setValue(place.name)
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.tenderForm.controls['latitude'].setValue(this.lat)
          this.tenderForm.controls['longitude'].setValue(this.lng)
          this.agmMap.zoom = 10;
        });
      });
    });
  }

  getLocation() {
    let longitude = this.tenderForm.value.longitude;
    let latitude = this.tenderForm.value.latitude;
    this.lat = latitude;
    this.lng = longitude;
  }

  mapClicked(event: MouseEvent) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.tenderForm.controls['longitude'].setValue(this.lng);
    this.tenderForm.controls['latitude'].setValue(this.lat);
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder;

      let latlng = {
        lat: this.lat,
        lng: this.lng
      };
      geocoder.geocode({
        'location': latlng
      }, (results) => {
        if (results[0]) {
          let currentLocation = results[0].formatted_address;
          this.tenderForm.controls['locationName'].setValue(currentLocation)
        } else {
          console.log('Not found');
        }
      });
    });
  }


  // -------------------------------------------------------map----------------------------------------------------------

  findBookletPrice() {
    let amount = this.tenderForm.value.tenderAmount;
    if (amount >= 10000) {
      this.tenderForm.controls['tenderAmount'].setValidators([Validators.pattern('')]);
      this.tenderForm.controls['tenderAmount'].updateValueAndValidity();
      let amountPer = ((amount) * (0.0001));
      let amountPer2 = Math.round(amountPer);
      this.tenderForm.controls['bookletPrice'].setValue(amountPer ? amountPer2 : '')
      this.bookletPrice = amountPer2;
    } else {
      this.tenderForm.controls['tenderAmount'].setValidators([Validators.pattern('((0?[1-9])|(1[0-4]))[0-9]-[0-9]{3}-[0-9]{3}')]);
      this.tenderForm.controls['tenderAmount'].updateValueAndValidity();

      this.snakBar.open("Please enter Tender Amount more than 10000", 'ok');
      setTimeout(() => {
        this.snakBar.dismiss();
      }, 2000);
    }
  }

  patchValue() {
    this.tenderForm.patchValue({
      gov_TenderId: this.editObj.gov_TenderId,
      country: '3',
      govtBody: this.editObj.govtBody?.id == null ? '' : this.editObj?.govtBody.id,
      category: this.editObj?.category.id,
      tenderId: this.editObj.tenderId,
      tenderAmount: this.editObj?.tenderAmount,
      bookletPrice: this.editObj?.bookletPrice,
      tenderName: this.editObj.tenderName,
      closingDate: this.editObj.closingDate.split('T')[0],
      description: this.editObj.description,
      locationName: this.editObj.locationName,
      latitude: this.editObj.latitude,
      longitude: this.editObj.longitude,
      personName: this.editObj.personName,
      designation: this.editObj.designation,
      contactNo: this.editObj.contactNo,
      rfpDocLink: this.editObj.rfpDocLink,
    })

    this.bookletPrice = this.editObj.bookletPrice;
    this.lat = this.editObj.latitude;
    this.lng = this.editObj.longitude;
    this.zoom = 2;
    this.profileImg = this.editObj?.tenderImagePath;
    this.showPDF = this.editObj?.tenderDocPath;
    if (this.editObj?.tenderDocPath) {
      this.rfpType = 'Document';
    } else if (this.editObj?.rfpDocLink) {
      this.rfpType = 'Link';
    }
    this.getGovtBody();
    this.getLocation();
  }

  updateValidations() {
    if (this.tenderForm.value.govtBody == '1') {
      this.tenderForm.controls['zone'].setValidators([Validators.required]);
      this.tenderForm.controls['zone'].updateValueAndValidity();
      this.tenderForm.controls['division_District'].setValidators([Validators.required]);
      this.tenderForm.controls['division_District'].updateValueAndValidity();

      this.tenderForm.controls['state'].setValidators([]);
      this.tenderForm.controls['state'].updateValueAndValidity();
      this.tenderForm.controls['district'].setValidators([]);
      this.tenderForm.controls['district'].updateValueAndValidity();

    } else if (this.tenderForm.value.govtBody == '2') {
      this.tenderForm.controls['state'].setValidators([Validators.required]);
      this.tenderForm.controls['state'].updateValueAndValidity();
      this.tenderForm.controls['zone'].setValidators([Validators.required]);
      this.tenderForm.controls['zone'].updateValueAndValidity();
      this.tenderForm.controls['division_District'].setValidators([Validators.required]);
      this.tenderForm.controls['division_District'].updateValueAndValidity();

      this.tenderForm.controls['district'].setValidators([]);
      this.tenderForm.controls['district'].updateValueAndValidity();

    } else if (this.tenderForm.value.govtBody == '3') {
      this.tenderForm.controls['state'].setValidators([Validators.required]);
      this.tenderForm.controls['state'].updateValueAndValidity();
      this.tenderForm.controls['district'].setValidators([Validators.required]);
      this.tenderForm.controls['district'].updateValueAndValidity();

      this.tenderForm.controls['division_District'].setValidators([]);
      this.tenderForm.controls['division_District'].updateValueAndValidity();
      this.tenderForm.controls['zone'].setValidators([]);
      this.tenderForm.controls['zone'].updateValueAndValidity();
    }
  }

  onSubmit() {
    this.updateValidations()
    if (this.tenderForm.invalid) {
      return
    } else {
      let obj = this.tenderForm.value;
      let obj1 = {
        "createdBy": this.editObj ? this.editObj.createdBy : '',
        "createdDate": "2022-10-17T07:29:46.971Z",
        "isDeleted": true,
        "modifiedBy": "",
        "modifiedDate": "2022-10-17T07:29:46.971Z",
        "id": {},
        "gov_TenderId": obj.gov_TenderId,
        "country": this.countryDropdownArray.find((res) => {
          if (res.id == obj.country) {
            return res;
          }
        }),
        "govtBody": this.govtBodyArray.find((res) => {
          if (res.id == obj.govtBody) {
            return res;
          }
        }),
        "ministry": this.ministryDropdownArray.find((res) => {
          if (res.id == obj.ministry) {
            return res;
          }
        }),
        "state": this.stateDropdownArray.find((res) => {
          if (res.id == obj.state) {
            return res;
          }
        }),
        "district": this.districtDeopdownArray.find((res) => {
          if (res.id == obj.district) {
            return res;
          }
        }),
        "division_District": this.distDivisionDropdownArray.find((res) => {
          if (res.id == obj.division_District) {
            return res;
          }
        }),
        "category": this.categoryDropdownArray.find((res) => {
          if (res.id == obj.category) {
            return res;
          }
        }),
        "zone": this.zoneDropdownArray.find((res) => {
          if (res.id == obj.zone) {
            return res;
          }
        }),
        "expertiseArea": this.expertiseAreaArray.find((res) => {
          if (res.id == obj.expertiseArea) {
            return res;
          }
        }),
        "tenderId": this.editObj ? this.editObj.tenderId : '',
        "tenderAmount": obj.tenderAmount,
        "bookletPrice": this.bookletPrice?.toString(),
        "tenderName": obj.tenderName,
        "description": obj.description,
        "closingDate": obj.closingDate,
        "locationName": obj.locationName,
        "latitude": obj.latitude.toString(),
        "longitude": obj.longitude.toString(),
        "personName": obj.personName,
        "designation": obj.designation,
        "contactNo": obj.contactNo,
        "tenderImagePath": obj.tenderImagePath,
        "tenderDocPath": obj.tenderDocPath,
        "tenderQuestionaryPath": obj.tenderQuestionaryPath,
        "rfpDocLink": obj.rfpDocLink,
        "tenderPublishStatus": true,
        "tenderQuestionAnswer": [
          {
            "qId": 0,
            "qCategory": "string",
            "tenderQuestion": "string",
            "tenderAnswer": [
              {
                "aId": "string",
                "answer": "string",
                "subAnswer": [
                  {
                    "id": "string",
                    "name": "string"
                  }
                ]
              }
            ]
          }
        ]
      }
      if (this.editFlag) {
        this.api.setHttp('put', 'Tender/Management/update', false, obj1, false, 'baseURL');
        this.api.getHttp().subscribe({
          next: ((res: any) => {
            if (res.statusCode == '200') {
              this.tenderId = res.responseData.tenderId
              this.saveImage();
              this.router.navigateByUrl('/tenders')
              this.snakBar.open(res.statusMessage, 'ok')
            }
          }),
          error: (error: any) => {
            console.log(error);
          }
        })

      } else {
        this.api.setHttp('post', 'Tender/Management/insert', false, obj1, false, 'baseURL');
        this.api.getHttp().subscribe({
          next: ((res: any) => {
            if (res.statusCode == '200') {
              this.tenderId = res.responseData.tenderId
              this.saveImage();
              this.router.navigateByUrl('/tenders')
              this.snakBar.open(res.statusMessage, 'ok')
            }
          }),
          error: (error: any) => {
            console.log(error);
          }
        })
      }
    }
  }

  clearForm() {
    this.tenderForm.controls['tenderDocPath'].setValue('')
    this.showPDF = '';
    this.tenderForm.controls['tenderImagePath'].setValue('')
    this.profileImg = '';
  }


  zoomChange(event: any) {
    console.log("Zoom Event: ", event);
    this.agmMap.zoom = 8

  }

}
