import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layouts } from './app.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { SearchCustomerComponent } from './Component/dashboard/search-customer/search-customer.component';
import { SearchTransactionComponent } from './Component/dashboard/search-transaction/search-transaction.component';
import { KycManagementComponent } from './Component/kyc-management/kyc-management.component';
import { LoginComponent } from './Component/login/login.component';
import { AddUserGridComponent } from './Component/user-management/add-user-grid/add-user-grid.component';
import { AddNewComponent } from './Component/user-management/add-new/add-new.component';
import { UserManagementComponent } from './Component/user-management/user-management.component';
import {BillerComponent} from './Component/biller/biller.component';
import { AuthGuard } from './Services/auth.guard';
import { UserRoleComponent } from './Component/user-management/user-role/user-role.component';
import { UserPermissionComponent } from './Component/user-management/user-permission/user-permission.component';
import { ErrorComponent } from './Component/error/error.component';
import { ReportsAdminComponent } from './Component/reports/reports-admin/reports-admin.component';
import { AddReportComponent } from './Component/reports/reports-admin/add-report/add-report.component';
import { ReportsComponent } from './Component/reports/reports.component';
import { ReportCategoryComponent } from './Component/reports/report-category/report-category.component';
import { AddNewCategoryComponent } from './Component/reports/report-category/add-new-category/add-new-category.component';
import { AddRoleComponent } from './Component/user-management/user-role/add-role/add-role.component';
import { AddPermissionComponent } from './Component/user-management/user-permission/add-permission/add-permission.component';
import { MerchantOnboardingComponent } from './Component/merchant/merchant-onboarding/merchant-onboarding.component';
import { MerchantSearchComponent } from './Component/merchant/merchant-search/merchant-search.component';
import { BulkUploadComponent } from './Component/merchant/merchant-onboarding/bulk-upload/bulk-upload.component';
import { ViewReportComponent } from './Component/reports/view-report/view-report.component';
import { FetchReportComponent } from './Component/reports/view-report/fetch-report/fetch-report.component';
import { DisputeManagementComponent } from './Component/dispute-management/dispute-management.component';
import { UpdateMerchantDetailsComponent } from './Component/merchant/merchant-search/update-merchant-details/update-merchant-details.component';
import { OtpComponent } from './Component/otp/otp.component';
import { ResetPasswordComponent } from './Component/login/reset-password/reset-password.component';
import { SessionTimeoutGuard } from './Services/session-timeout.guard';
import { RcManagementComponent } from './Component/rc-management/rc-management.component';
import { UpdateRcLocalComponent } from './Component/rc-management/update-rc-local/update-rc-local.component';
import { AddRcLocalDialogComponent } from './Component/rc-management/add-rc-local-dialog/add-rc-local-dialog.component';
import { MetaConfigComponent } from './Component/Meta_config/meta-config/meta-config.component';
import { DailogConfigComponent } from './Component/Meta_config/meta-config/dailog-config/dailog-config.component';
import { AddRefundPayoutComponent } from './Component/cashback/add-refund-payout/add-refund-payout.component';
import { ApproveRefundPayoutComponent } from './Component/cashback/approve-refund-payout/approve-refund-payout.component';
import { RefundPayoutHistoryComponent } from './Component/cashback/refund-payout-history/refund-payout-history.component';
import { CashbackBulkUploadComponent } from './Component/cashback/add-refund-payout/cashback-bulk-upload/cashback-bulk-upload.component';
import { RechargeWalletComponent } from './Component/cashback/load/recharge-wallet/recharge-wallet.component';
import { RejLoadComponent } from './Component/cashback/load/cashbackload/rej-load/rej-load.component';
import { ScheduledReportsComponent } from './Component/reports/scheduled-reports/scheduled-reports/scheduled-reports.component';
import { LoadUpiBulkUploadComponent } from './Component/auto-recon/load-upi/load-upi-bulk-upload/load-upi-bulk-upload.component';
import { LoadUPIComponent } from './Component/auto-recon/load-upi/load-upi.component';
import { AppRejAutoreconComponent } from './Component/auto-recon/app-rej-autorecon/app-rej-autorecon.component';
import { AutoReconHistoryComponent } from './Component/auto-recon/auto-recon-history/auto-recon-history.component';
import { ReconBulkHistoryComponent } from './Component/auto-recon/recon-bulk-history/recon-bulk-history.component';
import { AddBlacklistCustomerDialogComponent } from './Component/blacklist-customer/search-blacklist-customer/add-blacklist-customer-dialog/add-blacklist-customer-dialog.component';
import { BlacklistBulkUploadComponent } from './Component/blacklist-customer/search-blacklist-customer/blacklist-bulk-upload/blacklist-bulk-upload.component';
import { SearchBlacklistCustomerComponent } from './Component/blacklist-customer/search-blacklist-customer/search-blacklist-customer.component';
import { ApproveRejectBlacklistCustomerComponent } from './Component/blacklist-customer/approve-reject-blacklist-customer/approve-reject-blacklist-customer.component';
import { BlacklistCustomerHistoryComponent } from './Component/blacklist-customer/blacklist-customer-history/blacklist-customer-history.component';
import { AddDisbursementComponent } from './Component/pcbdc-management/add-disbursement/add-disbursement.component';
import { DisbursementHistoryComponent } from './Component/pcbdc-management/add-disbursement/disbursement-history/disbursement-history.component';
import { ViewRcbdcBalanceComponent } from './Component/pcbdc-management/view-rcbdc-balance/view-rcbdc-balance.component';
import { PcbdcConversionStatusHistoryComponent } from './Component/pcbdc-management/pcbdc-conversion-status-history/pcbdc-conversion-status-history.component';
import { RuleHistoryComponent } from './Component/pcbdc-management/add-sponsor-rule/rule-history/rule-history.component';
import { AddSponsorRuleComponent } from './Component/pcbdc-management/add-sponsor-rule/add-sponsor-rule.component';
import { AddSponsorComponent } from './Component/pcbdc-management/add-sponsor/add-sponsor.component';
import { UpdateRuleDenominationsComponent } from './Component/pcbdc-management/sponsor-rule-search/update-rule-denominations/update-rule-denominations.component';
import { UpdateRuleComponent } from './Component/pcbdc-management/sponsor-rule-search/update-rule/update-rule.component';
import { SponsorRuleSearchComponent } from './Component/pcbdc-management/sponsor-rule-search/sponsor-rule-search.component';
import { AddPayoutComponent } from './Component/payout/add-payout/add-payout.component';
import { PayoutBulkUploadComponent } from './Component/payout/add-payout/payout-bulk-upload/payout-bulk-upload.component';
import { PayoutHistoryComponent } from './Component/payout/payout-history/payout-history.component';
import { AppRejPayoutComponent } from './Component/payout/app-rej-payout/app-rej-payout.component';
import { CreateVoucherComponent } from './Component/voucher-management/create-voucher/create-voucher.component';
import { SearchVoucherComponent } from './Component/voucher-management/search-voucher/search-voucher.component';
import { UpdateVoucherComponent } from './Component/voucher-management/search-voucher/update-voucher/update-voucher.component';
import { TopupVoucherComponent } from './Component/voucher-management/search-voucher/topup-voucher/topup-voucher.component';
import { SearchVoucherTransactionComponent } from './Component/voucher-management/search-voucher-transaction/search-voucher-transaction.component';
import { VoucherSettlementComponent } from './Component/voucher-management/voucher-settlement/voucher-settlement.component';
import { ChannelOnboardingComponent } from './Component/channel-onboarding/channel-onboarding.component';
// import { AgentComponent } from './Component/agent/agent.component';
import { PlanComponent } from './Component/plan/plan.component';
import { BillerSearchComponent } from './Component/biller-search/biller-search.component';
import { AgentSearchComponent } from './Component/agent-search/agent-search.component';
import { AISearchComponent } from './Component/ai-search/ai-search.component';
import { AgentComponent } from './Component/agent/agent.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { layout: Layouts.DEFAULT }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { layout: Layouts.SIDENAV, breadcrumb: [{ name: "Dashboard", route: '' }] },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'search-transactions',
    component: SearchTransactionComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search Transactions', route: '' }],
      permissions: 'manage-tokensearch,view-tokensearch',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },

  {
    path: 'Ai-search',
    component: AISearchComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search AI', route: '' }],
      permissions: 'manage-tokensearch,view-tokensearch',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },



  {
    path: 'search-Agent',
    component: AgentSearchComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search Agent', route: '' }],
      permissions: 'manage-tokensearch,view-tokensearch',
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'search-customers',
    component: SearchCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search Customers', route: '' }],
      permissions: 'manage-customersearch,view-customersearch'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  }, {
    path: 'blacklist-customer/search-blacklist-customer',
    component: SearchBlacklistCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search Blacklist Customers', route: '' }],
      permissions: 'manage-mobile-blacklist,checker-mobile-blacklist'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'blacklist-customer/search-blacklist-customer/blacklist-bulk-upload',
    component: BlacklistBulkUploadComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{
        name: 'Bulk Upload Blacklist Customers', route: ''
      }],
      permissions: 'manage-mobile-blacklist-bulk-file-upload'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'blacklist-customer/blacklist-history',
    component: BlacklistCustomerHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Approve/Reject Blacklist Customer', route: '' }],
      permissions: 'manage-mobile-blacklist,checker-mobile-blacklist'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'blacklist-customer/approve-reject-blacklist-customer',
    component: ApproveRejectBlacklistCustomerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Approve/Reject Blacklist Customer', route: '' }],
      permissions: 'checker-mobile-blacklist'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'search-customer/add',
    component: AddBlacklistCustomerDialogComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Add Blacklist Customer', route: '' }],
      permissions: 'manage-mobile-blacklist,checker-mobile-blacklist'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/user',
    component: UserManagementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: '' }],
      permissions: 'manage-user,view-user'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },

  {
    path: 'MDM/Agent',
    component: AgentComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Agent", route: 'MDM/Agent' },
      { name: 'Agent', route: '' }],
      permissions: 'manage-role,view-role'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'mdm/biller',
    component: BillerComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "MDM", route: '/mdm/biller' },
        { name: 'Biller', route: '' }],
      // permissions: 'manage-user,view-user'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'channel-onboarding',
    component: ChannelOnboardingComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Channel Onboarding", route: 'channel-onboarding' },
      // { name: 'agent', route: '' }],
      ],
      permissions: 'manage-user'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]

   
  },
  {
    path: 'user-management/add-user',
    component: AddUserGridComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Add User', route: '' }],
      permissions: 'manage-user,view-user'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/add',
    component: AddNewComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Add User', route: '' }],
      permissions: 'manage-user'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },

 
  
  {
    path: 'mdm/plan',
    component: PlanComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "MDM", route: '/mdm/plan' },
      { name: 'Plan', route: '' }],
      permissions: 'manage-user'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/view/:id',
    component: AddNewComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'View User', route: '' }],
      permissions: 'view-user'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/role',
    component: UserRoleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Role', route: '' }],
      permissions: 'manage-role,view-role'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/role/edit/:id',
    component: AddRoleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Role', route: 'user-management/role' }, { name: 'Edit', route: '' }],
      permissions: 'manage-role'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/role/view/:id',
    component: AddRoleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Role', route: 'user-management/role' }, { name: 'View', route: '' }],
      permissions: 'view-role'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/role/add',
    component: AddRoleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Role', route: 'user-management/role' }, { name: 'Add', route: '' }],
      permissions: 'manage-role'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/permission',
    component: UserPermissionComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Permission', route: '' }],
      permissions: 'manage-permission,view-permission'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/permission/edit/:id',
    component: AddPermissionComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Permission', route: 'user-management/permission' }, { name: 'Edit', route: '' }],
      permissions: 'manage-permission'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'user-management/permission/view/:id',
    component: AddPermissionComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "User Management", route: 'user-management/user' },
      { name: 'Permission', route: 'user-management/permission' }, { name: 'View', route: '' }],
      permissions: 'view-permission'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'kyc-management',
    component: KycManagementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'KYC Management', route: '' }],
      permissions: 'manage-kyclimit,view-kyclimit'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'rc-management',
    component: RcManagementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'RC Management', route: '' }],
      permissions: 'view-rc,manage-rc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'rc-management/add-rc-local-dialog',
    component: AddRcLocalDialogComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Add Local RC', route: '' }],
      permissions: 'manage-rc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'rc-management/update-rc-local',
    component: UpdateRcLocalComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Update RC Local', route: '' }],
      permissions: 'manage-rc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'biller-onboarding',
    component: MerchantOnboardingComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Biller Onboarding', route: '' }],
      permissions: 'manage-merchant,manage-bulk-file-upload'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },

  {
    path: 'biller-search',
    component:BillerSearchComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: ' Search Biller', route: '' }],
      permissions: 'manage-merchant,manage-bulk-file-upload'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },


  {
    path: 'merchant-onboarding/bulk-upload',
    component: BulkUploadComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Merchant Onboarding', route: 'merchant-onboarding' },
      { name: 'Bulk Upload', route: '' }],
      permissions: 'manage-merchant,manage-bulk-file-upload'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'payout/add-payout',
    component: AddPayoutComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Add Payout', route: '' }],
      permissions: 'manage-disbursement,checker-disbursement,manage-disbursement-bulk-file-upload'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'payout/add-payout/bulk-upload',
    component: PayoutBulkUploadComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Add Payout', route: 'payout/add-payout' },
      { name: 'Bulk Upload', route: '' }],
      permissions: 'manage-disbursement-bulk-file-upload,checker-disbursement,manage-disbursement'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'payout/app-rej-payout',
    component: AppRejPayoutComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Payout Approve/Reject', route: '' }],
      permissions: 'checker-disbursement'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'payout/history',
    component: PayoutHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Payout History', route: '' }],
      permissions: 'checker-disbursement,manage-disbursement'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'biller-search',
    component: MerchantSearchComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Merchant Search', route: '' }],
      permissions: 'manage-merchant,view-merchant,searchMerchant-merchant'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'merchant-search/edit',
    component: UpdateMerchantDetailsComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Merchant Search", route: 'merchant-search' },
      { name: "Edit Merchant Details", route: '' }],
      permissions: 'manage-merchant,searchMerchant-merchant'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'dispute-management',
    component: DisputeManagementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Dispute Management', route: '' }],
      permissions: 'manage-dispute,view-dispute'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Reports", route: '' }],
      permissions: 'view-report,manage-report,view-reportcategory,manage-reportcategory,view-task,manage-task,view-scheduler,manage-scheduler'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard],
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'reports-admin'
    },
    {
      path: 'reports-admin',
      component: ReportsAdminComponent,
      data: {
        layout: Layouts.SIDENAV,
        breadcrumb: [{ name: "Reports Admin", route: '' }],
        permissions: 'manage-report'
      },
      canActivate: [AuthGuard, SessionTimeoutGuard]
    },
    ]
  },
  {
    path: 'reports/edit',
    component: AddReportComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Reports Admin", route: 'reports/reports-admin' }, { name: "Edit Report", route: '' }],
      permissions: 'manage-report'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports/add-report',
    component: AddReportComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Reports Admin", route: 'reports/reports-admin' }, { name: "Add Report", route: '' }],
      permissions: 'manage-report'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports/view-report',
    component: ViewReportComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'View Report', route: '' }],
      permissions: 'view-report,manage-report'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports/view-report/:id',
    component: FetchReportComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "View Report", route: '' }],
      permissions: 'view-report,manage-report'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports/report-category',
    component: ReportCategoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Report Category', route: '' }],
      permissions: 'view-reportcategory,manage-reportcategory'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports/report-category/add',
    component: AddNewCategoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Report Category', route: 'reports/report-category' }, { name: 'Add Category', route: '' }],
      permissions: 'manage-reportcategory'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports/report-category/edit',
    component: AddNewCategoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Report Category', route: 'reports/report-category' }, { name: 'Edit Category', route: '' }],
      permissions: 'manage-reportcategory'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reports/report-category/view',
    component: AddNewCategoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Report Category', route: 'reports/report-category' }, { name: 'View Category', route: '' }],
      permissions: 'view-reportcategory'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'verify-user',
    component: OtpComponent,
    data: { layout: Layouts.DEFAULT },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },


  {
    path: 'reports/scheduled-reports',
    component: ScheduledReportsComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Scheduled Reports', route: '' }],
      permissions: 'view-report'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'meta-config',
    component: MetaConfigComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Institute Configuration', route: '' }],
      permissions: 'view-institute-app-config,manage-institute-app-config'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'meta-config/add',
    component: DailogConfigComponent,
    data: {
      layout: Layouts.SIDENAV, breadcrumb: [{ name: 'New record', route: 'DailogConfigComponent' },
      { name: 'Add record', route: '' }],
      permissions: 'manage-institute-app-config'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'meta-config/edit/:id',
    component: DailogConfigComponent,
    data: {
      layout: Layouts.SIDENAV, breadcrumb: [{ name: 'edit record', route: 'DailogConfigComponent' },
      { name: 'edit record', route: '' }],
      permissions: 'view-institute-app-config,manage-institute-app-config'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'meta-config/view',
    component: DailogConfigComponent,
    data: {
      layout: Layouts.SIDENAV, breadcrumb: [{ name: 'New record', route: 'DailogConfigComponent' },
      { name: 'Add record', route: '' }],
      permissions: 'view-institute-app-config,manage-institute-app-config'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'add-cashback',
    component: AddRefundPayoutComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Add Cashback', route: '' }],
      permissions: 'manage-reward-bulk-file-upload,manage-reward'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'add-cashback/bulk-upload',
    component: CashbackBulkUploadComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Add Cashback', route: 'add-cashback' },
      { name: 'Bulk Upload', route: '' }],
      permissions: 'manage-reward-bulk-file-upload'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'cashback/approve-refund-payout',
    component: ApproveRefundPayoutComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Approve/Reject Cashback', route: '' }],
      permissions: 'checker-reward'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'cashback/refund-payout-history',
    component: RefundPayoutHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Cashback History', route: '' }],
      permissions: 'manage-reward,checker-reward'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'cashback/load/recharge-wallet',
    component: RechargeWalletComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Load', route: '' }],
      permissions: 'manage-reward'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'cashback/load/cashbackload',
    component: RejLoadComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Approve/Reject Load', route: '' }],
      permissions: 'checker-reward'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'load-upi',
    component: LoadUPIComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Manual Transaction', route: '' }],
      permissions: 'manage-auto-recon,checker-auto-recon'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'load-upi/bulk-upload',
    component: LoadUpiBulkUploadComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Manual Transaction', route: 'load-upi' },
      { name: 'Bulk Upload', route: '' }],
      permissions: 'manage-auto-recon,checker-auto-recon,manage-auto-recon-bulk-file-upload'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'voucher-management/create-voucher',
    component: CreateVoucherComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Voucher Management", route: '' },
      { name: 'Create Voucher', route: '' }],
      permissions: 'manage-gff-voucher'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'voucher-management/search-voucher',
    component: SearchVoucherComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: "Voucher Management", route: '' },
      { name: 'Search Voucher', route: '' }],
      permissions: 'manage-gff-voucher,view-gff-voucher'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'voucher-management/search-voucher/update-voucher',
    component: UpdateVoucherComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Edit Voucher', route: '' }],
      permissions: 'manage-gff-voucher,view-gff-voucher'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'voucher-management/search-voucher-transcation',
    component: SearchVoucherTransactionComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Search Voucher Transaction', route: '' }],
      permissions: 'manage-gff-voucher,view-gff-voucher'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'voucher-management/voucher-settlement',
    component: VoucherSettlementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Voucher Settlement', route: '' }],
      permissions: 'manage-gff-voucher,view-gff-voucher'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'approve-rej',
    component: AppRejAutoreconComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Approve/Reject', route: '' }],
      permissions: 'checker-auto-recon'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },

  {
    path: 'History',
    component: AutoReconHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'History', route: '' }],
      permissions: 'manage-auto-recon,checker-auto-recon'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },

  {
    path: 'bulk-history',
    component: ReconBulkHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Bulk History', route: '' }],
      permissions: 'manage-auto-recon,checker-auto-recon,manage-auto-recon-bulk-file-upload'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/sponsor-creation',
    component: AddSponsorComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Sponsor Creation', route: '' }],
      permission: 'manage-pcbdc'

    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/pcbdc-creation',
    component: AddSponsorRuleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'PCDBC Rule Creation', route: '' }],
      permission: 'manage-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/sponsor-rule-search',
    component: SponsorRuleSearchComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'PCBDC Rule Search', route: '' }],
      permission: 'manage-pcbdc,checker-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/sponsor-rule-search/update-rule',
    component: UpdateRuleComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'PCDBC Rule Enhancement', route: '' }],
      permission: 'manage-pcbdc,checker-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/sponsor-rule-search/update-rule-denomination',
    component: UpdateRuleDenominationsComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'PCDBC Rule Top-Up', route: '' }],
      permission: 'manage-pcbdc,checker-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/rule-history',
    component: RuleHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'PCBDC Rule History', route: '' }],
      permission: 'manage-pcbdc,checker-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/pcbdc-conversion-status-history',
    component: PcbdcConversionStatusHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'PDBC Check Status', route: '' }],
      permission: 'checker-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/add-disbursement',
    component: AddDisbursementComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Add Disbursement', route: '' }],
      permission: 'manage-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/disbursement-history',
    component: DisbursementHistoryComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'Disbursement History', route: '' }],
      permission: 'manage-pcbdc,checker-pcbdc,manage-pcbdc-bulk-file-upload'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: 'pcbdc-management/view-rcbdc-balance',
    component: ViewRcbdcBalanceComponent,
    data: {
      layout: Layouts.SIDENAV,
      breadcrumb: [{ name: 'R-CBDC Balance', route: '' }],
      permission: 'manage-pcbdc,checker-pcbdc'
    },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  },
  {
    path: '**',
    component: ErrorComponent,
    data: { layout: Layouts.DEFAULT },
    canActivate: [AuthGuard, SessionTimeoutGuard]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
