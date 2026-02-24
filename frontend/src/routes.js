import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const DashboardGrafik = React.lazy(() => import('./views/dashboard/DashboardGrafik'))
const DashboardDetail = React.lazy(() => import('./views/dashboard/DashboardDetail'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

//Users
const Users = React.lazy(() => import('./views/users/Users'))
const AddUser = React.lazy(() => import('./views/users/AddUser'))
const EditUser = React.lazy(() => import('./views/users/EditUser'))

//Customer
const Customers = React.lazy(() => import('./views/customers/Customers'))
const AddCustomer = React.lazy(() => import('./views/customers/AddCustomer'))
const EditCustomer = React.lazy(() => import('./views/customers/EditCustomer'))

//Parts
const Parts = React.lazy(() => import('./views/parts/Parts'))
const AddParts = React.lazy(() => import('./views/parts/AddParts'))
const EditParts = React.lazy(() => import('./views/parts/EditParts'))

//Kalender Kerja
const kalenderKerja = React.lazy(() => import('./views/kalenderKerja/KalenderKerja'))
const AddKalenderKerja = React.lazy(() => import('./views/kalenderKerja/AddKalenderKerja'))
const EditKalenderKerja = React.lazy(() => import('./views/kalenderKerja/EditKalenderKerja'))

//Lead Time
const LeadTime = React.lazy(() => import('./views/leadTime/LeadTime'))
const AddLeadTime = React.lazy(() => import('./views/leadTime/AddLeadTime'))
const EditLeadTime = React.lazy(() => import('./views/leadTime/EditLeadTime'))

//ActualPackaging
const ActualPackaging = React.lazy(() => import('./views/actualPackaging/ActualPackaging'))
const AddActualPackaging = React.lazy(() => import('./views/actualPackaging/AddActualPackaging'))
const EditActualPackaging = React.lazy(() => import('./views/actualPackaging/EditActualPackaging'))

//Kendaraan
const Kendaraan = React.lazy(() => import('./views/kendaraan/Kendaraan'))
const AddKendaraan = React.lazy(() => import('./views/kendaraan/AddKendaraan'))
const EditKendaraan = React.lazy(() => import('./views/kendaraan/EditKendaraan'))

//Reader
const Reader = React.lazy(() => import('./views/readers/Reader'))
const AddReader = React.lazy(() => import('./views/readers/AddReader'))
const EditReader = React.lazy(() => import('./views/readers/EditReader'))

//Jenis Packaging
const PackagingType = React.lazy(() => import('./views/type-packaging/PackagingType'))
const AddPackagingType = React.lazy(() => import('./views/type-packaging/AddPackagingType'))
const EditPackagingType = React.lazy(() => import('./views/type-packaging/EditPackagingType'))

//Packaging
const Packaging = React.lazy(() => import('./views/packaging/Packaging'))
const AddPackaging = React.lazy(() => import('./views/packaging/AddPackaging'))
const EditPackaging = React.lazy(() => import('./views/packaging/EditPackaging'))

//Assets
const Assets = React.lazy(() => import('./views/assets/Assets'))
const AddAsset = React.lazy(() => import('./views/assets/AddAsset'))
const EditAsset = React.lazy(() => import('./views/assets/EditAsset'))

//Repair
const Repair = React.lazy(() => import('./views/repairs/Repair'))
const AddRepair = React.lazy(() => import('./views/repairs/AddRepair'))

//Assets
const AssetEventList = React.lazy(() => import('./views/asset-events/AssetEventList'))
const ScanAsset = React.lazy(() => import('./views/asset-events/ScanAsset'))

//Packaging Customer
const PackagingCustomer = React.lazy(() => import('./views/packagingcustomer/PackagingCustomer'))
const AddPackagingCustomer = React.lazy(() => import('./views/packagingcustomer/AddPackagingCustomer'))
const EditPackagingCustomer = React.lazy(() => import('./views/packagingcustomer/EditPackagingCustomer'))


//Asset Event
const AssetEvent = React.lazy(() => import('./views/assetevent/AssetEvent'))

//Aset Forecast
const Forecast = React.lazy(() => import('./views/forecast/Forecast'))
const AddForecast = React.lazy(() => import('./views/forecast/AddForecast'))
const HitungForecast = React.lazy(() => import('./views/forecast/HitungForecast'))
const ForecastMonth = React.lazy(() => import('./views/forecast/ForecastMonth'))
const ForecastInput = React.lazy(() => import('./views/forecast/ForecastInput'))
const DetailForecast = React.lazy(() => import('./views/forecast/DetailForecast'))

//Aset Kebutuhan
const Kebutuhan = React.lazy(() => import('./views/kebutuhan/Kebutuhan'))

//Tracking
const Tracking = React.lazy(() => import('./views/tracking/Tracking'))
const TrackingDetail = React.lazy(() => import('./views/tracking/TrackingDetail'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/dashboard/grafik/:customer/:asset', name: 'Dashboard Grafik', element: DashboardGrafik },
  { path: '/dashboard/detail/:asset', name: 'Dashboard Detail', element: DashboardDetail },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/add', name: 'Tambah User', element: AddUser },
  { path: '/users/edit/:id', name: 'Edit User', element: EditUser },
  { path: '/customers', name: 'Customers', element: Customers },
  { path: '/customer/add', name: 'Tambah Customer', element: AddCustomer },
  { path: '/customer/edit/:id', name: 'Edit Customer', element: EditCustomer },
  { path: '/parts', name: 'Parts', element: Parts },
  { path: '/parts/add', name: 'Tambah Parts', element: AddParts },
  { path: '/parts/edit/:id', name: 'Edit Parts', element: EditParts },
  { path: '/packaging-type', name: 'Tipe Packaging', element: PackagingType },
  { path: '/packaging-type/add', name: 'Tambah Tipe Packaging', element: AddPackagingType },
  { path: '/packaging-type/edit/:id', name: 'Edit Tipe Packaging', element: EditPackagingType },
  { path: '/packaging', name: 'Packaging', element: Packaging },
  { path: '/packaging/add', name: 'Tambah Packaging', element: AddPackaging },
  { path: '/packaging/edit/:id', name: 'Edit Packaging', element: EditPackaging },

  {
    path: "/assets",
    name: "Assets",
    element: Assets,
  },
  {
    path: "/assets/add",
    name: "Tambah Asset",
    element: AddAsset,
  },
  { path: '/assets/edit/:id', name: 'Edit Asset', element: EditAsset },

  {
    path: "/asset-events",
    name: "Asset Events",
    element: AssetEventList,
  },
  {
    path: "/asset-events/scan",
    name: "Scan Asset",
    element: ScanAsset,
  },
  { path: '/packagingcustomer', name: 'Packaging Customer', element: PackagingCustomer },
  { path: '/packagingcustomer/add', name: 'Tambah Packaging Sustomer', element: AddPackagingCustomer },
  { path: '/packagingcustomer/edit/:id', name: 'Edit Packaging Customer', element: EditPackagingCustomer },
  { path: '/kendaraan', name: 'Kendaraan', element: Kendaraan },
  { path: '/kendaraan/add', name: 'Tambah Kendaraan', element: AddKendaraan },
  { path: '/kendaraan/edit/:id', name: 'Edit Kendaraan', element: EditKendaraan },
  { path: '/reader', name: 'Reader', element: Reader },
  { path: '/reader/add', name: 'Tambah Reader', element: AddReader },
  { path: '/reader/edit/:id', name: 'Edit Reader', element: EditReader },

  { path: '/repair', name: 'Repair', element: Repair },
  { path: '/repair/add', name: 'Tambah Repair', element: AddRepair },

  { path: '/kalender-kerja', name: 'kalenderKerja', element: kalenderKerja },
  { path: '/kalender-kerja/add', name: 'Tambah kalender kerja', element: AddKalenderKerja },
  { path: '/kalender-kerja/edit/:id', name: 'Edit kalender kerja', element: EditKalenderKerja },

  { path: '/lead-time', name: 'Lead Time', element: LeadTime },
  { path: '/lead-time/add', name: 'Tambah Lead Time', element: AddLeadTime },
  { path: '/lead-time/edit/:id', name: 'Edit Lead Time', element: EditLeadTime },

  { path: '/actual-packaging', name: 'Actual Packaging', element: ActualPackaging },
  { path: '/actual-packaging/add', name: 'Tambah Actual Packaging', element: AddActualPackaging },
  { path: '/actual-packaging/edit/:id', name: 'Edit Actual Packaging', element: EditActualPackaging },

  { path: '/assetevent', name: 'Asset Event', element: AssetEvent },

  {
    path: '/forecast',
    name: 'Kebutuhan Packaging',
    element: Forecast // default tampil tabel final
  },
  {
    path: '/forecast/add',
    name: 'Input Forecast Bulanan',
    element: AddForecast
  },
  {
    path: '/forecast/input',
    name: 'Input Data Forecast',
    element: ForecastInput
  },
  {
    path: '/forecast/hitung',
    name: 'Hitung Forecast',
    element: HitungForecast
  },

  { path: '/kebutuhan', name: 'Kebutuhan Aset', element: Kebutuhan },
  { path: '/tracking', name: 'Tracking', element: Tracking },
  { path: '/tracking/:asset_code', element: TrackingDetail },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tabs', name: 'Tabs', element: Tabs },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
