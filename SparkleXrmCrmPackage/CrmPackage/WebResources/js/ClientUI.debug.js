//! ClientUI.debug.js
//

(function($){

Type.registerNamespace('ClientUI.Model');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.Model.Contact

ClientUI.Model.Contact = function ClientUI_Model_Contact() {
    ClientUI.Model.Contact.initializeBase(this, [ 'contact' ]);
    this._metaData['creditlimit'] = SparkleXrm.Sdk.AttributeTypes.money;
}
ClientUI.Model.Contact.prototype = {
    contactid: null,
    parentcustomerid: null,
    creditlimit: null,
    firstname: null,
    fullname: null,
    lastname: null,
    preferredcontactmethodcode: null
}


Type.registerNamespace('ClientUI');

////////////////////////////////////////////////////////////////////////////////
// ResourceStrings

ResourceStrings = function ResourceStrings() {
}


Type.registerNamespace('ClientUI.ViewModel');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ContactViewModel

ClientUI.ViewModel.ContactViewModel = function ClientUI_ViewModel_ContactViewModel() {
    this.AllowAddNew = ko.observable(true);
    ClientUI.ViewModel.ContactViewModel.initializeBase(this);
    var contact = new ClientUI.ViewModel.ObservableContact();
    this.contacts = new SparkleXrm.GridEditor.EntityDataViewModel(15, ClientUI.Model.Contact, false);
    this.ContactEdit = ko.validatedObservable(contact);
    this.ContactEdit().add_onSaveComplete(ss.Delegate.create(this, this._contactViewModel_OnSaveComplete$1));
    this.ErrorMessage = ko.observable();
    this.contacts.onDataLoaded.subscribe(ss.Delegate.create(this, this._contacts_OnDataLoaded$1));
    ClientUI.ViewModel.ObservableContact.registerValidation(this.contacts.validationBinder);
}
ClientUI.ViewModel.ContactViewModel.getAccountId = function ClientUI_ViewModel_ContactViewModel$getAccountId() {
    var accountId = '';
    if (window.parent.Xrm.Page.ui != null) {
        var guid = window.parent.Xrm.Page.data.entity.getId();
        if (guid != null) {
            accountId = guid.replaceAll('{', '').replaceAll('}', '');
        }
    }
    return accountId;
}
ClientUI.ViewModel.ContactViewModel.prototype = {
    contacts: null,
    _recordCount$1: 10,
    ErrorMessage: null,
    ContactEdit: null,
    
    _contacts_OnDataLoaded$1: function ClientUI_ViewModel_ContactViewModel$_contacts_OnDataLoaded$1(e, data) {
        var args = data;
        for (var i = 0; i < args.to + 1; i++) {
            var contact = this.contacts.getItem(i);
            if (contact == null) {
                return;
            }
            contact.add_propertyChanged(ss.Delegate.create(this, this._contact_PropertyChanged$1));
        }
    },
    
    _contact_PropertyChanged$1: function ClientUI_ViewModel_ContactViewModel$_contact_PropertyChanged$1(sender, e) {
        var update = sender;
        Xrm.Utility.alertDialog(String.format('First Name is {0}, Last Name is {1}, Credit limit is {2}', update.lastname, update.creditlimit), function() {
        });
        SparkleXrm.Sdk.OrganizationServiceProxy.beginUpdate(update, ss.Delegate.create(this, function(state) {
            try {
                SparkleXrm.Sdk.OrganizationServiceProxy.update(update);
                this.ErrorMessage('');
            }
            catch (ex) {
                this.ErrorMessage(ex.message);
            }
            finally {
            }
        }));
    },
    
    _contactViewModel_OnSaveComplete$1: function ClientUI_ViewModel_ContactViewModel$_contactViewModel_OnSaveComplete$1(result) {
        if (result == null) {
            this.ErrorMessage(null);
            this.contacts.reset();
            this.contacts.refresh();
        }
        else {
            this.ErrorMessage(result);
        }
    },
    
    search: function ClientUI_ViewModel_ContactViewModel$search() {
        this.contacts.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping='logical'  returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>\r\n                                            <entity name='contact'>\r\n                                            <attribute name='firstname' />\r\n                                            <attribute name='lastname' />\r\n                                            <attribute name='preferredcontactmethodcode' />\r\n                                            <attribute name='creditlimit' />                                            \r\n                                            <attribute name='contactid' />\r\n                                            <attribute name='parentcustomerid' />\r\n                                            <order attribute='fullname' descending='false' />\r\n                                      <filter>\r\n                                        <condition attribute='parentcustomerid' operator='eq' value='" + ClientUI.ViewModel.ContactViewModel.getAccountId() + "' />\r\n                                       </filter>   \r\n                                            {3}\r\n                                            </entity>\r\n                                        </fetch>");
    },
    
    AddNewCommand: function ClientUI_ViewModel_ContactViewModel$AddNewCommand() {
        this.ContactEdit().AddNewVisible(true);
    }
}


////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ObservableContact

ClientUI.ViewModel.ObservableContact = function ClientUI_ViewModel_ObservableContact() {
    this.AddNewVisible = ko.observable(false);
    this.contactid = ko.observable();
    this.parentcustomerid = ko.observable();
    this.creditlimit = ko.observable();
    this.firstname = ko.observable();
    this.fullname = ko.observable();
    this.lastname = ko.observable();
    this.preferredcontactmethodcode = ko.observable();
    ClientUI.ViewModel.ObservableContact.initializeBase(this);
    ClientUI.ViewModel.ObservableContact.registerValidation(new SparkleXrm.ObservableValidationBinder(this));
}
ClientUI.ViewModel.ObservableContact.validateLastName = function ClientUI_ViewModel_ObservableContact$validateLastName(rules, viewModel, dataContext) {
    return rules.addRequiredMsg(ResourceStrings.RequiredMessage);
}
ClientUI.ViewModel.ObservableContact.registerValidation = function ClientUI_ViewModel_ObservableContact$registerValidation(binder) {
    binder.register('lastname', ClientUI.ViewModel.ObservableContact.validateLastName);
}
ClientUI.ViewModel.ObservableContact.prototype = {
    
    add_onSaveComplete: function ClientUI_ViewModel_ObservableContact$add_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.combine(this.__onSaveComplete$1, value);
    },
    remove_onSaveComplete: function ClientUI_ViewModel_ObservableContact$remove_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.remove(this.__onSaveComplete$1, value);
    },
    
    __onSaveComplete$1: null,
    
    CancelCommand: function ClientUI_ViewModel_ObservableContact$CancelCommand() {
        this.AddNewVisible(false);
    },
    
    SaveCommand: function ClientUI_ViewModel_ObservableContact$SaveCommand() {
        var contactIsValid = (this).isValid();
        if (!contactIsValid) {
            (this).errors.showAllMessages(true);
            return;
        }
        this.isBusy(true);
        var contact = new ClientUI.Model.Contact();
        var accountId = '';
        if (window.parent.Xrm.Page.ui != null) {
            var guid = window.parent.Xrm.Page.data.entity.getId();
            if (guid != null) {
                accountId = guid.replaceAll('{', '').replaceAll('}', '');
            }
        }
        contact.parentcustomerid = new SparkleXrm.Sdk.EntityReference(new SparkleXrm.Sdk.Guid(accountId), 'account', null);
        contact.creditlimit = this.creditlimit();
        contact.firstname = this.firstname();
        contact.lastname = this.lastname();
        contact.preferredcontactmethodcode = this.preferredcontactmethodcode();
        SparkleXrm.Sdk.OrganizationServiceProxy.beginCreate(contact, ss.Delegate.create(this, function(state) {
            try {
                this.contactid(SparkleXrm.Sdk.OrganizationServiceProxy.endCreate(state));
                this.__onSaveComplete$1(null);
                (this).errors.showAllMessages(false);
            }
            catch (ex) {
                this.__onSaveComplete$1(ex.message);
            }
            finally {
                this.isBusy(false);
                this.AddNewVisible(false);
            }
        }));
    },
    
    OpenAssociatedSubGridCommand: function ClientUI_ViewModel_ObservableContact$OpenAssociatedSubGridCommand() {
        var item = window.parent.Xrm.Page.ui.navigation.items.get('navContacts');
        item.setFocus();
    },
    
    contactSearchCommand: function ClientUI_ViewModel_ObservableContact$contactSearchCommand(account, callback) {
        var contactFetchXml = String.format("<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>\n                                          <entity name='contact'>\n                                            <attribute name='fullname' />\n                                            <attribute name='telephone1' />\n                                            <attribute name='contactid' />\n                                            <order attribute='fullname' descending='false' />\n                                            <filter type='and'>\n                                              <condition attribute='parentcustomerid' operator='eq' uiname='A. Datum' uitype='account' value='{0}' />\n                                            </filter>\n                                          </entity>\n                                        </fetch>", SparkleXrm.Sdk.Guid.empty);
        SparkleXrm.Sdk.OrganizationServiceProxy.beginRetrieveMultiple(contactFetchXml, function(result) {
            var contactFetchResult = SparkleXrm.Sdk.OrganizationServiceProxy.endRetrieveMultiple(result, SparkleXrm.Sdk.Entity);
            callback(contactFetchResult);
        });
    }
}


Type.registerNamespace('ClientUI.View');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.View.ContactView

ClientUI.View.ContactView = function ClientUI_View_ContactView() {
}
ClientUI.View.ContactView.Init = function ClientUI_View_ContactView$Init() {
    ClientUI.View.ContactView.vm = new ClientUI.ViewModel.ContactViewModel();
    var columns = [];
    SparkleXrm.GridEditor.GridDataViewBinder.addEditIndicatorColumn(columns);
    SparkleXrm.GridEditor.XrmTextEditor.bindColumn(SparkleXrm.GridEditor.GridDataViewBinder.addColumn(columns, ResourceStrings.FirstName, 200, 'firstname'));
    SparkleXrm.GridEditor.XrmTextEditor.bindColumn(SparkleXrm.GridEditor.GridDataViewBinder.addColumn(columns, ResourceStrings.LastName, 200, 'lastname'));
    SparkleXrm.GridEditor.XrmOptionSetEditor.bindColumn(SparkleXrm.GridEditor.GridDataViewBinder.addColumn(columns, ResourceStrings.PreferredContactType, 200, 'preferredcontactmethodcode'), 'contact', 'preferredcontactmethodcode', false);
    SparkleXrm.GridEditor.XrmMoneyEditor.bindColumn(SparkleXrm.GridEditor.GridDataViewBinder.addColumn(columns, ResourceStrings.CreditLimit, 200, 'creditlimit'), -1000, 100000000);
    var contactGridDataBinder = new SparkleXrm.GridEditor.GridDataViewBinder();
    var contactsGrid = contactGridDataBinder.dataBindXrmGrid(ClientUI.View.ContactView.vm.contacts, columns, 'container', 'pager', true, true);
    contactGridDataBinder.bindCommitEdit(ClientUI.View.ContactView.vm);
    SparkleXrm.ViewBase.registerViewModel(ClientUI.View.ContactView.vm);
    window.setTimeout(function() {
        ClientUI.View.ContactView.vm.search();
        ClientUI.View.ContactView.vm.contacts.refresh();
    }, 0);
}


ClientUI.Model.Contact.registerClass('ClientUI.Model.Contact', SparkleXrm.Sdk.Entity);
ResourceStrings.registerClass('ResourceStrings');
ClientUI.ViewModel.ContactViewModel.registerClass('ClientUI.ViewModel.ContactViewModel', SparkleXrm.ViewModelBase);
ClientUI.ViewModel.ObservableContact.registerClass('ClientUI.ViewModel.ObservableContact', SparkleXrm.ViewModelBase);
ClientUI.View.ContactView.registerClass('ClientUI.View.ContactView');
ResourceStrings.RequiredMessage = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Requerido' : 'Required';
ResourceStrings.SaveButton = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Guardar' : 'Save';
ResourceStrings.CancelButton = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Cancelar' : 'Cancel';
ResourceStrings.Contacts = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Contacto' : 'Contacts';
ResourceStrings.FirstName = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Nombre' : 'First Name';
ResourceStrings.LastName = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Apellido' : 'Last Name';
ResourceStrings.CreditLimit = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Limite de credito' : 'Credit Limit';
ResourceStrings.PreferredContactType = (SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings().uilanguageid === 3082) ? 'Metodo de contacto' : 'Preferred Contact Method';
ClientUI.View.ContactView.vm = null;
ClientUI.View.ContactView.contactsGrid = null;
ClientUI.View.ContactView.currentUserSettings = null;
})(window.xrmjQuery);


