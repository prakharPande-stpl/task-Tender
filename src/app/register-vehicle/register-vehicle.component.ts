import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-register-vehicle',
  templateUrl: './register-vehicle.component.html',
  styleUrls: ['./register-vehicle.component.css']
})
export class RegisterVehicleComponent implements OnInit {

  resigterVehicalFrom!: FormGroup

  dataSource = new Array();
  displayedColumns = ['SrNo', 'vehicleNo', 'ownerName', 'ownerMobileNo', 'driverMobileNo', 'Action'];

  totalCount: number = 0;
  currentPage: number = 0;

  editObj: any
  editFlag: boolean = false;

  vehicleTypeArr = [
    { id: 1, type: 'Tractor' },
    { id: 2, type: 'Truck' },
    { id: 3, type: 'Hywa' },
    { id: 4, type: 'Other' },
    { id: 6, type: 'Tipper' }
  ];

  telecomProviderArr = ['Vodafone', 'Idea', 'Airtel', 'Jio', 'BSNL'];
  @ViewChild('FrontView') FrontView!: ElementRef;
  @ViewChild('SideView') SideView!: ElementRef;
  @ViewChild('numberView') numberView!: ElementRef;

  FrontViewImg: string = 'http://wbmining.mahamining.com/assets/images/front_vehicle.svg';
  SideViewImg: string = 'http://wbmining.mahamining.com/assets/images/side_vehicle.svg';
  numberViewImg: string = 'http://wbmining.mahamining.com/assets/images/Number_plate.svg';

  selFrontViewImg: any;
  selSideViewImg: any;
  selnumberViewImg: any;

  constructor(private callService: ServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formData();
    this.getAllData();
  }

  formData() {
    this.resigterVehicalFrom = this.fb.group({
      "createdBy": 0,
      "modifiedBy": 0,
      "createdDate": "2022-09-28T04:57:00.646Z",
      "modifiedDate": "2022-09-28T04:57:00.646Z",
      "isDeleted": true,
      "id": 0,
      "vehicleRegistrationNo": [''],
      "state": [''],
      "district": [''],
      "series": [''],
      "number": [''],
      "oldState": [''],
      "oldNum": [''],
      "ownerName": [''],
      "capacity": 0,
      "vehicleTypeId": 0,
      "vehicleOwnerId": 0,
      "ownerMobileNo": [''],
      "driverName": [''],
      "driverMobileNo": [''],
      "address": [''],
      "licenseNo": [''],
      "permitNo": [''],
      "trainingDate": "2022-09-28T04:57:00.646Z",
      "isBlock": true,
      "serviceProvider": [''],
      "deviceId": [''],
      "deviceCompanyId": 0,
      "deviceSIMNo": [''],
      "activationKey": [''],
      "activationKey1ExpireDate": "2022-09-28T04:57:00.646Z",
      "activationKey1LockOutCount": 0,
      "version": [''],
      "registrationId": [''],
      "transporterMobileNo": [''],
      "transporterId": 0,
      "nfcTagId": [''],
      "isRegisteredByOffice": true,
      "registeredBy": 0,
      "ownerAadharNo": 0,
      "ownerAadharFilePath": [''],
      "taxFilePath": [''],
      "insuranceFilePath": [''],
      "permitFilePath": [''],
      "certificateFilePath": [''],
      "rlw": 0,
      "ulw": 0,
      "cc": 0,
      "receiptNo": [''],
      "amount": 0,
      "applicationFormFilePath": [''],
      "invoiceCounter": 0,
      "transportType": ['Vehicle'],  // transportType
      "remark": [''],
      "originalDeviceId": [''],
      "length": [0],
      "width": [0],
      "height": 0,
      "isVerified": true,
      "isForceValidateGPSDataConsistent": true,
      "forceValidateBy": 0,
      "forceValidateDate": "2022-09-28T04:57:00.646Z",
      "blockedBy": 0,
      "blockedDate": "2022-09-28T04:57:00.646Z",
      "isSuspicious": true,
      "suspiciousReason": [''],
      "suspiciousDate": "2022-09-28T04:57:00.646Z",
      "secondarySIMNo": [''],
      "primaryTelecomProvider": [''],
      "secondaryTelecomProvider": [''],
      "manufacturerId": 0,
      "tenantId": [''],
      "rfid": [''],
      "otp": [''],
      "frontImage": [''],
      "sideImage": [''],
      "numberPlateImage": [''],
      "mobileNo": [''],
      "deviceCompanyName": [''],
      "eTpMobileNumber": [''],
      "flag": ['i'],
      "pageName": ['']
    })
  }


  getAllData() {
    this.callService.setHttp('get', 'api/VehicleRegistration?pageno=' + (this.currentPage + 1) + '&pagesize=10', false, false, false,
      'VehicleRegistration');
    this.callService.getHttp().subscribe({
      next: (res: any) => {
        this.dataSource = res.responseData.responseData1;
        this.totalCount = res.responseData.responseData2.totalCount;
      }
    })
  }

  pageChanged(event: any) {
    this.currentPage = event.pageIndex;
    this.getAllData();
  }

  imgUpload(event: any, flag: string) {
    let checkFileType = event.target.value.split('.')[1];
    checkFileType = checkFileType.toLowerCase();
    if (checkFileType == 'png' || checkFileType == 'jpg') {
      const file = event.target.files[0];
      if (file.size > 500000) {
        this.FrontView.nativeElement.value = '';
        return;
      }
      let reader = new FileReader();
      reader.onload = (event: any) => {
        if (flag == 'FrontViewImg') {
          this.FrontViewImg = event.target.result;
          this.selFrontViewImg = file;
        } else if (flag == 'SideViewImg') {
          this.SideViewImg = event.target.result;
          this.selSideViewImg = file;
        } else if (flag == 'numberViewImg') {
          this.numberViewImg = event.target.result;
          this.selnumberViewImg = file;
        }
      }
      reader.readAsDataURL(file);
    }
    else {
      //this.mat.open('false','cancel');
      return;
    }
  }

  clearImg(imgName: string) {
    if (imgName == 'FrontViewImg') {
      this.FrontView.nativeElement.value = '';
      this.selFrontViewImg = '';
      this.FrontViewImg = 'http://wbmining.mahamining.com/assets/images/front_vehicle.svg';

    } else if (imgName == 'SideViewImg') {
      this.SideView.nativeElement.value = '';
      this.selSideViewImg = '';
      this.SideViewImg = 'http://wbmining.mahamining.com/assets/images/side_vehicle.svg';

    } else if (imgName == 'numberViewImg') {
      this.numberView.nativeElement.value = '';
      this.selnumberViewImg = '';
      this.numberViewImg = 'http://wbmining.mahamining.com/assets/images/Number_plate.svg';

    } else if (imgName == 'clearAll') {
      this.FrontView.nativeElement.value = '';
      this.selFrontViewImg = '';
      this.FrontViewImg = 'http://wbmining.mahamining.com/assets/images/front_vehicle.svg';
      this.SideView.nativeElement.value = '';
      this.selSideViewImg = '';
      this.SideViewImg = 'http://wbmining.mahamining.com/assets/images/side_vehicle.svg';
      this.numberView.nativeElement.value = '';
      this.selnumberViewImg = '';
      this.numberViewImg = 'http://wbmining.mahamining.com/assets/images/Number_plate.svg';
    }
  }

  editProfile(obj: any) {
    console.log(obj);
    this.editObj = obj
    this.editFlag = true;
    this.formData();

  }
  onSubmit() {
    this.editFlag = false
    let fromData = new FormData();
    fromData.append('VehicleFrontSideImage', this.selFrontViewImg);
    fromData.append('VehicleSideImage', this.selSideViewImg);
    fromData.append('VehicleNumberImage', this.selnumberViewImg);

    this.callService.setHttp('post', 'WB-mining/uploads/save-vehicle-image', false, fromData, false, 'VehicleRegistration');
    this.callService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.postApi();
        }
      }
    })
    this.resigterVehicalFrom.reset();
    // this.formData();
  }

  postApi() {
    let obj = this.resigterVehicalFrom.value;

    if (obj.version == 'new') {
      obj.vehicleRegistrationNo = (obj.state + obj.district + obj.series + obj.number)
    } else if (obj.version == 'old') {
      obj.vehicleRegistrationNo = (obj.oldNum + obj.oldState)
    }

    if (obj.isBlock == 'true') {
      obj.isBlock = true;
    } else {
      obj.isBlock = false;
    }
    console.log(obj);

    this.callService.setHttp('post', 'api/VehicleRegistration/SaveUpdateVehicleRegistration', false, obj, false,
      'VehicleRegistration');
    this.callService.getHttp().subscribe({
      next: (res: any) => {
        this.getAllData()
      }
    })
  }

}
