import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { NavigationComponent } from './Component/navigation/navigation.component';
import { UserManagementComponent } from './Component/user-management/user-management.component';
import { KycManagementComponent } from './Component/kyc-management/kyc-management.component';
import { LoginComponent } from './Component/login/login.component';
import { DialogComponent } from './Shared/dialog/dialog.component';
import { TableComponent } from './Shared/table/table.component';
import { UserService } from './Services/user.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpCallInterceptor } from './Shared/interceptor/http-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { AddNewComponent } from './Component/user-management/add-new/add-new.component';
import { NoRightClickDirective } from './Directives/prevent-right-click.directive';
import { SearchTransactionComponent } from './Component/dashboard/search-transaction/search-transaction.component';
import { SearchCustomerComponent } from './Component/dashboard/search-customer/search-customer.component';
import { AddUserGridComponent } from './Component/user-management/add-user-grid/add-user-grid.component';
import { UserRoleComponent } from './Component/user-management/user-role/user-role.component';
import { UserPermissionComponent } from './Component/user-management/user-permission/user-permission.component';
import { ErrorComponent } from './Component/error/error.component';
import { AddRoleComponent } from './Component/user-management/user-role/add-role/add-role.component';
import { AddPermissionComponent } from './Component/user-management/user-permission/add-permission/add-permission.component';
import { SharedModule } from './Shared/shared.module';
import { ReportCategoryComponent } from './Component/reports/report-category/report-category.component';
import { AddNewCategoryComponent } from './Component/reports/report-category/add-new-category/add-new-category.component';
import { ReportsAdminComponent } from './Component/reports/reports-admin/reports-admin.component';
import { ReportsComponent } from './Component/reports/reports.component';
import { AddReportComponent } from './Component/reports/reports-admin/add-report/add-report.component';
import { MerchantOnboardingComponent } from './Component/merchant/merchant-onboarding/merchant-onboarding.component';
import { MerchantSearchComponent } from './Component/merchant/merchant-search/merchant-search.component';
import { DatePipe } from '@angular/common';
import { QRCodeDialog } from './Component/merchant/merchant-search/qr-dialog/qr-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { BulkUploadComponent } from './Component/merchant/merchant-onboarding/bulk-upload/bulk-upload.component';
import { ShareQrComponent } from './Component/merchant/merchant-search/share-qr/share-qr.component';
import { ViewReportComponent } from './Component/reports/view-report/view-report.component';
import { ReportFilterPipe } from './Pipes/report-filter.pipe';
import { FetchReportComponent } from './Component/reports/view-report/fetch-report/fetch-report.component';
import { DisputeManagementComponent } from './Component/dispute-management/dispute-management.component';
import { DialogDisputeComponent } from './Component/dispute-management/dialog-dispute/dialog-dispute.component';
import { CheckPermissionDirective } from './Directives/check-permission.directive';
import { DialogChangePasswordComponent } from './Component/navigation/dialog-change-password/dialog-change-password.component';
import { ExpandableTableComponent } from './Shared/expandable-table/expandable-table.component';
import { OnlyNumber } from './Directives/onlynumber.directive';
import { RestrictSpecialCharacters } from './Directives/restrictSpecialCharacters.directive';
import { UpdateMerchantDetailsComponent } from './Component/merchant/merchant-search/update-merchant-details/update-merchant-details.component';
import { Amount } from './Directives/amount.directive';
import { DialogTxnIdComponent } from './Component/dashboard/search-transaction/dialog-txn-id/dialog-txn-id.component';
// import { FileUploadDialogComponent } from './Component/merchant/merchant-onboarding/bulk-upload/file-upload-dialog/file-upload-dialog.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SharedService } from './Services/shared.service';
import { OtpComponent } from './Component/otp/otp.component';
import { ResetPasswordComponent } from './Component/login/reset-password/reset-password.component';
import { UserIdleModule } from 'angular-user-idle';
import { RcManagementComponent } from './Component/rc-management/rc-management.component';
import { AddRcDialogComponent } from './Component/rc-management/add-rc-dialog/add-rc-dialog.component';
import { AddRcLocalDialogComponent } from './Component/rc-management/add-rc-local-dialog/add-rc-local-dialog.component';
import { UpdateRcLocalComponent } from './Component/rc-management/update-rc-local/update-rc-local.component';
import { MetaConfigComponent } from './Component/Meta_config/meta-config/meta-config.component';
import { DailogConfigComponent } from './Component/Meta_config/meta-config/dailog-config/dailog-config.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddRefundPayoutComponent } from './Component/cashback/add-refund-payout/add-refund-payout.component';
import { ApproveRefundPayoutComponent } from './Component/cashback/approve-refund-payout/approve-refund-payout.component';
import { ApprejDialogComponent } from './Component/cashback/approve-refund-payout/apprej-dialog/apprej-dialog.component';
import { RefundPayoutHistoryComponent } from './Component/cashback/refund-payout-history/refund-payout-history.component';
import { CashbackBulkUploadComponent } from './Component/cashback/add-refund-payout/cashback-bulk-upload/cashback-bulk-upload.component';
import { CashbackFileUploadDialogComponent } from './Component/cashback/add-refund-payout/cashback-bulk-upload/cashback-file-upload-dialog/cashback-file-upload-dialog.component';
import { RechargeWalletComponent } from './Component/cashback/load/recharge-wallet/recharge-wallet.component';
import { LoadDialogComponent } from './Component/cashback/load/cashbackload/load-dialog/load-dialog.component';
import { RejLoadComponent } from './Component/cashback/load/cashbackload/rej-load/rej-load.component';
import { NgxCaptchaModule } from '@binssoft/ngx-captcha';
import { ScheduledReportsComponent } from './Component/reports/scheduled-reports/scheduled-reports/scheduled-reports.component';
import { LoadUPIComponent } from './Component/auto-recon/load-upi/load-upi.component';
import { LoadUpiBulkUploadComponent } from './Component/auto-recon/load-upi/load-upi-bulk-upload/load-upi-bulk-upload.component';
import { AppRejAutoreconComponent } from './Component/auto-recon/app-rej-autorecon/app-rej-autorecon.component';
import { LoadUpiFileUploadDialogComponent } from './Component/auto-recon/load-upi/load-upi-file-upload-dialog/load-upi-file-upload-dialog.component';
import { AutoReconService } from './Services/auto-recon.service';
import { AutoReconHistoryComponent } from './Component/auto-recon/auto-recon-history/auto-recon-history.component';
import { ReconBulkHistoryComponent } from './Component/auto-recon/recon-bulk-history/recon-bulk-history.component';
import { AddBlacklistCustomerDialogComponent } from './Component/blacklist-customer/search-blacklist-customer/add-blacklist-customer-dialog/add-blacklist-customer-dialog.component';
import { SearchBlacklistCustomerComponent } from './Component/blacklist-customer/search-blacklist-customer/search-blacklist-customer.component';
import { BlacklistBulkUploadComponent } from './Component/blacklist-customer/search-blacklist-customer/blacklist-bulk-upload/blacklist-bulk-upload.component';
import { BlacklistFileUploadDialogComponent } from './Component/blacklist-customer/search-blacklist-customer/blacklist-bulk-upload/blacklist-file-upload-dialog/blacklist-file-upload-dialog.component';
import { UpdateBlacklistCustomerComponent } from './Component/blacklist-customer/search-blacklist-customer/update-blacklist-customer/update-blacklist-customer.component';
import { ApproveRejectBlacklistCustomerComponent } from './Component/blacklist-customer/approve-reject-blacklist-customer/approve-reject-blacklist-customer.component';
import { BlacklistCustomerHistoryComponent } from './Component/blacklist-customer/blacklist-customer-history/blacklist-customer-history.component';

import { RuleHistoryComponent } from './Component/pcbdc-management/add-sponsor-rule/rule-history/rule-history.component';
import { PcbdcConversionStatusHistoryComponent } from './Component/pcbdc-management/pcbdc-conversion-status-history/pcbdc-conversion-status-history.component';
import { PcbdcConversionStatusDialogComponent } from './Component/pcbdc-management/pcbdc-conversion-status-history/pcbdc-conversion-status-dialog/pcbdc-conversion-status-dialog.component';
import { RuleRemarkDialogComponent } from './Component/pcbdc-management/add-sponsor-rule/rule-history/rule-remark-dialog/rule-remark-dialog.component';
import { AddSponsorComponent } from './Component/pcbdc-management/add-sponsor/add-sponsor.component';
import { AddDisbursementComponent } from './Component/pcbdc-management/add-disbursement/add-disbursement.component';
import { DisbursementHistoryComponent } from './Component/pcbdc-management/add-disbursement/disbursement-history/disbursement-history.component';
import { DisbursementApproveRejectDialogComponent } from './Component/pcbdc-management/add-disbursement/disbursement-history/disbursement-approve-reject-dialog/disbursement-approve-reject-dialog.component';
import { DisbursementRemarkDialogComponent } from './Component/pcbdc-management/add-disbursement/disbursement-history/disbursement-remark-dialog/disbursement-remark-dialog.component';
import { DisbursementFileUploadDialogComponent } from './Component/pcbdc-management/add-disbursement/disbursement-file-upload-dialog/disbursement-file-upload-dialog.component';
import { AddSponsorRuleComponent } from './Component/pcbdc-management/add-sponsor-rule/add-sponsor-rule.component';
import { ViewRcbdcBalanceComponent } from './Component/pcbdc-management/view-rcbdc-balance/view-rcbdc-balance.component';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { UpdateRuleDenominationsComponent } from './Component/pcbdc-management/sponsor-rule-search/update-rule-denominations/update-rule-denominations.component';
import { SponsorRuleSearchComponent } from './Component/pcbdc-management/sponsor-rule-search/sponsor-rule-search.component';
import { UpdateRuleComponent } from './Component/pcbdc-management/sponsor-rule-search/update-rule/update-rule.component';
import { AddPayoutComponent } from './Component/payout/add-payout/add-payout.component';
import { PayoutHistoryComponent } from './Component/payout/payout-history/payout-history.component';
import { AppRejPayoutComponent } from './Component/payout/app-rej-payout/app-rej-payout.component';
import { PayoutBulkUploadComponent } from './Component/payout/add-payout/payout-bulk-upload/payout-bulk-upload.component';
import { PayoutFileUploadDailogComponent } from './Component/payout/add-payout/payout-file-upload-dailog/payout-file-upload-dailog.component';
import { CreateVoucherComponent } from './Component/voucher-management/create-voucher/create-voucher.component';
import { SearchVoucherComponent } from './Component/voucher-management/search-voucher/search-voucher.component';
import { GenerateQrComponent } from './Component/voucher-management/search-voucher/generate-qr/generate-qr.component';
import { TopupVoucherComponent } from './Component/voucher-management/search-voucher/topup-voucher/topup-voucher.component';
import { UpdateVoucherComponent } from './Component/voucher-management/search-voucher/update-voucher/update-voucher.component';
import { SearchVoucherTransactionComponent } from './Component/voucher-management/search-voucher-transaction/search-voucher-transaction.component';
import { VoucherSettlementComponent } from './Component/voucher-management/voucher-settlement/voucher-settlement.component';
import { SettlementDialogComponent } from './Component/voucher-management/voucher-settlement/settlement-dialog/settlement-dialog.component';
import { VoucherService } from './Services/voucher.service';
import { BillerComponent } from './Component/biller/biller.component';
import { FileUploadDialogComponent } from './Component/merchant/merchant-onboarding/bulk-upload/file-upload-dialog/file-upload-dialog.component';
import { DynamicQrComponent } from './Component/merchant/merchant-search/dynamic-qr/dynamic-qr.component';
import { BillerSearchComponent } from './Component/biller-search/biller-search.component';

import { AgentSearchComponent } from './Component/agent-search/agent-search.component';
import { AISearchComponent } from './Component/ai-search/ai-search.component';
import { AgentComponent } from './Component/agent/agent.component';
import { DialogagentComponent } from './Component/agent/dialogagent/dialogagent.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    UserManagementComponent,
    KycManagementComponent,
    LoginComponent,
    DialogComponent,
    TableComponent,
    ExpandableTableComponent,
    AddNewComponent,
    NoRightClickDirective,
    OnlyNumber,
    Amount,
    RestrictSpecialCharacters,
    SearchTransactionComponent,
    SearchCustomerComponent,
    AddUserGridComponent,
    UserRoleComponent,
    UserPermissionComponent,
    ErrorComponent,
    ReportsAdminComponent,
    ReportsComponent,
    AddReportComponent,
    ReportCategoryComponent,
    AddNewCategoryComponent,
    AddRoleComponent,
    AddPermissionComponent,
    MerchantOnboardingComponent,
    MerchantSearchComponent,
    QRCodeDialog,
    DynamicQrComponent,
    BulkUploadComponent,
    ShareQrComponent,
    ViewReportComponent,
    ReportFilterPipe,
    FetchReportComponent,
    DisputeManagementComponent,
    DialogDisputeComponent,
    CheckPermissionDirective,
    DialogChangePasswordComponent,
    UpdateMerchantDetailsComponent,
    DialogTxnIdComponent,

    FileUploadDialogComponent,
    OtpComponent,
    ResetPasswordComponent,
    RcManagementComponent,
    AddRcDialogComponent,
    AddRcLocalDialogComponent,
    UpdateRcLocalComponent,
    ResetPasswordComponent,
    MetaConfigComponent,
    DailogConfigComponent,
    AddRefundPayoutComponent,
    ApproveRefundPayoutComponent,
    ApprejDialogComponent,
    RefundPayoutHistoryComponent,
    CashbackBulkUploadComponent,
    CashbackFileUploadDialogComponent,
    LoadDialogComponent,
    RechargeWalletComponent,
    RejLoadComponent,
    ScheduledReportsComponent,
    LoadUPIComponent,
    LoadUpiBulkUploadComponent,
    AppRejAutoreconComponent,
    LoadUpiFileUploadDialogComponent,
    AutoReconHistoryComponent,
    ReconBulkHistoryComponent,
    SearchBlacklistCustomerComponent,
    AddBlacklistCustomerDialogComponent,
    BlacklistBulkUploadComponent,
    BlacklistFileUploadDialogComponent,
    UpdateBlacklistCustomerComponent,
    ApproveRejectBlacklistCustomerComponent,
    BlacklistCustomerHistoryComponent,
    AddReportComponent,
    AddSponsorRuleComponent,
    SponsorRuleSearchComponent,
    UpdateRuleComponent,
    UpdateRuleDenominationsComponent,
    RuleHistoryComponent,
    PcbdcConversionStatusHistoryComponent,
    PcbdcConversionStatusDialogComponent,
    RuleRemarkDialogComponent,
    AddSponsorComponent,
    AddDisbursementComponent,
    DisbursementFileUploadDialogComponent,
    DisbursementHistoryComponent,
    DisbursementApproveRejectDialogComponent,
    DisbursementRemarkDialogComponent,
    ViewRcbdcBalanceComponent,
    AddPayoutComponent,
    PayoutHistoryComponent,
    AppRejPayoutComponent,
    PayoutBulkUploadComponent,
    PayoutFileUploadDailogComponent,
    CreateVoucherComponent,
    SearchVoucherComponent,
    GenerateQrComponent,
    TopupVoucherComponent,
    UpdateVoucherComponent,
    SearchVoucherTransactionComponent,
    VoucherSettlementComponent,
    SettlementDialogComponent,
    BillerComponent,
    BillerSearchComponent,

    AgentSearchComponent,
    AISearchComponent,
    AgentComponent,
    DialogagentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      closeButton: false,
      timeOut: 3000,
      progressBar: false,
    }),
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    SharedModule,
    QRCodeModule,
    NgxCaptchaModule,
    NgOtpInputModule,
    UserIdleModule.forRoot({ idle: 450, timeout: 60 }),
  ],
  providers: [UserService, SharedService, AutoReconService, VoucherService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCallInterceptor,
      multi: true
    }, DatePipe, ReportFilterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
