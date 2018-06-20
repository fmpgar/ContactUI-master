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
    this.contacts = new SparkleXrm.GridEditor.EntityDataViewModel(15, ClientUI.Model.Contact, false);
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
ClientUI.ViewModel.ContactViewModel.prototype = {
    _recordCount$1: 10,
    ErrorMessage: null,
    ContactEdit: null,
    
    _contacts_OnDataLoaded$1: function ClientUI_ViewModel_ContactViewModel$_contacts_OnDataLoaded$1(e, data) {
        var args = data;
        for (var i = 0; i < args.to + 1; i++) {
            var contact = this.contacts.getItem(i);
            Xrm.Utility.alertDialog(String.format('First Name is {0}, Last Name is {1}, Credit limit is {2}', contact.firstname, contact.lastname, contact.creditlimit), function() {
            });
            if (contact == null) {
                return;
            }
            contact.add_propertyChanged(ss.Delegate.create(this, this._contact_PropertyChanged$1));
        }
    },
    
    _getAccountId$1: function ClientUI_ViewModel_ContactViewModel$_getAccountId$1() {
        var accountId = '8E649152-D273-E811-A965-000D3AB6E3A0';
        if (window.parent.Xrm.Page.ui != null) {
            var guid = window.parent.Xrm.Page.data.entity.getId();
            if (guid != null) {
                accountId = guid.replaceAll('{', '').replaceAll('}', '');
            }
        }
        return accountId;
    },
    
    _contact_PropertyChanged$1: function ClientUI_ViewModel_ContactViewModel$_contact_PropertyChanged$1(sender, e) {
        var update = sender;
        Xrm.Utility.alertDialog(String.format('First Name is {0}, Last Name is {1}, Credit limit is {2}', update.firstname, update.lastname, update.creditlimit), function() {
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
        Xrm.Utility.alertDialog('Alert1', function() {
        });
        this.contacts.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping='logical'  returntotalrecordcount='true' no-lock='true' distinct='false' count='{0}' paging-cookie='{1}' page='{2}'>\n                                            <entity name='contact'>\n                                            <attribute name='firstname' />\n                                            <attribute name='lastname' />\n                                            <attribute name='preferredcontactmethodcode' />\n                                            <attribute name='creditlimit' />                                            \n                                            <attribute name='contactid' />\n                                            <order attribute='fullname' descending='false' />\n                                            <filter type='and'>\n                                                <condition attribute='parentcustomerid' operator='eq' value='" + this._getAccountId$1() + "' />\n                                            </filter>                                            \n                                            {3}\n                                            </entity>\n                                        </fetch>");
        Xrm.Utility.alertDialog('Alert3', function() {
        });
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
    this.lastname = ko.observable();
    this.preferredcontactmethodcode = ko.observable();
    ClientUI.ViewModel.ObservableContact.initializeBase(this);
    ClientUI.ViewModel.ObservableContact.registerValidation(new SparkleXrm.ObservableValidationBinder(this));
}
ClientUI.ViewModel.ObservableContact.validateCreditLimit = function ClientUI_ViewModel_ObservableContact$validateCreditLimit(rules, viewModel, dataContext) {
    return rules.addRequiredMsg(ResourceStrings.RequiredMessage);
}
ClientUI.ViewModel.ObservableContact.validateLastName = function ClientUI_ViewModel_ObservableContact$validateLastName(rules, viewModel, dataContext) {
    return rules.addRequiredMsg(ResourceStrings.RequiredMessage);
}
ClientUI.ViewModel.ObservableContact.validatePreferredContactMethodCode = function ClientUI_ViewModel_ObservableContact$validatePreferredContactMethodCode(rules, viewModel, dataContext) {
    return rules.addRule('Preferred Contact Method is required', function(value) {
        return (value != null) && (value).value != null;
    });
}
ClientUI.ViewModel.ObservableContact.registerValidation = function ClientUI_ViewModel_ObservableContact$registerValidation(binder) {
    binder.register('lastname', ClientUI.ViewModel.ObservableContact.validateLastName);
    binder.register('creditlimit', ClientUI.ViewModel.ObservableContact.validateCreditLimit);
    binder.register('preferredcontactmethodcode', ClientUI.ViewModel.ObservableContact.validatePreferredContactMethodCode);
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
        contact.parentcustomerid = this.parentcustomerid();
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
        var item = window.parent.Xrm.Page.ui.navigation.items.get('navConnections');
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
    ClientUI.View.ContactView.currentUserSettings = SparkleXrm.Sdk.OrganizationServiceProxy.getUserSettings();
    var columns = SparkleXrm.GridEditor.GridDataViewBinder.parseLayout(String.format('{0}, firstname, 250, {1}, lastname, 250, {2}, creditlimit, 250, {3}, preferredcontactmethodcode, 250', ResourceStrings.FirstName, ResourceStrings.LastName, ResourceStrings.CreditLimit, ResourceStrings.PreferredContactType));
    var contactsDataBinder = new SparkleXrm.GridEditor.GridDataViewBinder();
    SparkleXrm.GridEditor.GridDataViewBinder.addEditIndicatorColumn(columns);
    SparkleXrm.GridEditor.XrmTextEditor.bindColumn(columns[0]);
    SparkleXrm.GridEditor.XrmTextEditor.bindColumn(columns[1]);
    SparkleXrm.GridEditor.XrmMoneyEditor.bindColumn(columns[2], -1000, 1000);
    SparkleXrm.GridEditor.XrmOptionSetEditor.bindColumn(columns[3], 'contact', 'preferredcontactmethodcode', false);
    ClientUI.View.ContactView.contactsGrid = contactsDataBinder.dataBindXrmGrid(ClientUI.View.ContactView.vm.contacts, columns, 'container', 'pager', true, false);
    contactsDataBinder.addCheckBoxSelectColumn = false;
    contactsDataBinder.bindClickHandler(ClientUI.View.ContactView.contactsGrid);
    SparkleXrm.ViewBase.registerViewModel(ClientUI.View.ContactView.vm);
    Xrm.Utility.alertDialog('Alert1', function() {
    });
    $(window).resize(ClientUI.View.ContactView._onResize);
    $(function() {
        ClientUI.View.ContactView.vm.search();
    });
}
ClientUI.View.ContactView._onResize = function ClientUI_View_ContactView$_onResize(e) {
    var height = $(window).height();
    var width = $(window).width();
    $('#container').height(height - 64).width(width - 1);
    ClientUI.View.ContactView.contactsGrid.resizeCanvas();
}


ClientUI.Model.Contact.registerClass('ClientUI.Model.Contact', SparkleXrm.Sdk.Entity);
ResourceStrings.registerClass('ResourceStrings');
ClientUI.ViewModel.ContactViewModel.registerClass('ClientUI.ViewModel.ContactViewModel', SparkleXrm.ViewModelBase);
ClientUI.ViewModel.ObservableContact.registerClass('ClientUI.ViewModel.ObservableContact', SparkleXrm.ViewModelBase);
ClientUI.View.ContactView.registerClass('ClientUI.View.ContactView');
ResourceStrings.RequiredMessage = 'Required';
ResourceStrings.SaveButton = 'Save';
ResourceStrings.CancelButton = 'Cancel';
ResourceStrings.Contacts = 'Contacts';
ResourceStrings.FirstName = 'First Name';
ResourceStrings.LastName = 'Last Name';
ResourceStrings.CreditLimit = 'Credit Limit';
ResourceStrings.PreferredContactType = 'Preferred Contact Method';
ClientUI.View.ContactView.vm = null;
ClientUI.View.ContactView.contactsGrid = null;
ClientUI.View.ContactView.currentUserSettings = null;
})(window.xrmjQuery);


