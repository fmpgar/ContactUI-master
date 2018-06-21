// Class1.cs
//

using ClientUI.ViewModel;
using jQueryApi;
using Slick;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm;
using Xrm.Sdk;
using System.Html;

namespace ClientUI.View
{

    public static class ContactView
    {
        public static ContactViewModel vm;
        public static Grid contactsGrid;
        public static UserSettings currentUserSettings;

        [PreserveCase]
        public static void Init()
        {

            vm = new ContactViewModel();

            List<Column> columns = new List<Column>();
            GridDataViewBinder.AddEditIndicatorColumn(columns);

            //Creacion de columnas para el grid
            XrmTextEditor.BindColumn(
                          GridDataViewBinder.AddColumn(columns, ResourceStrings.FirstName, 200, "firstname"));
            XrmTextEditor.BindColumn(
  GridDataViewBinder.AddColumn(columns, ResourceStrings.LastName, 200, "lastname"));

            XrmOptionSetEditor.BindColumn(
                GridDataViewBinder.AddColumn(columns, ResourceStrings.PreferredContactType, 200, "preferredcontactmethodcode"), "contact", "preferredcontactmethodcode", false);

            XrmMoneyEditor.BindColumn(
    GridDataViewBinder.AddColumn(columns, ResourceStrings.CreditLimit, 200, "creditlimit"), -1000, 100000000);

            //Montar grid
            GridDataViewBinder contactGridDataBinder = new GridDataViewBinder();
            Grid contactsGrid = contactGridDataBinder.DataBindXrmGrid(vm.Contacts, columns, "container", "pager", true, false);
            contactGridDataBinder.BindCommitEdit(vm);

            contactGridDataBinder.BindClickHandler(contactsGrid);

            ViewBase.RegisterViewModel(vm);
            Window.SetTimeout(delegate ()
            {
                vm.Search();
                vm.Contacts.Refresh();
            }, 0);


            /*CAMBIO DE IDIOMA A TRAVES DE JAVASCRIPT*/
            //int lcid = OrganizationServiceProxy.GetUserSettings().UILanguageId.Value;
            
            //LocalisedContentLoader.LoadContent("fmp_/js/Res.metadata.js", lcid, delegate ()
            //{

            //    ViewBase.RegisterViewModel(vm);
            //}); 


        }
    }
}
