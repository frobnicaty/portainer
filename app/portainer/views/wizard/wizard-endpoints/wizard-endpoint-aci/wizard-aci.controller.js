import { buildOption } from '@/portainer/components/box-selector';

export default class WizardAciController {
  /* @ngInject */
  constructor($async, EndpointService, Notifications, NameValidator) {
    this.$async = $async;
    this.EndpointService = EndpointService;
    this.Notifications = Notifications;
    this.NameValidator = NameValidator;
  }

  async addAciEndpoint() {
    const name = this.formValues.name;
    const azureApplicationId = this.formValues.azureApplicationId;
    const azureTenantId = this.formValues.azureTenantId;
    const azureAuthenticationKey = this.formValues.azureAuthenticationKey;
    const groupId = 1;
    const tagIds = [];

    try {
      this.state.actionInProgress = true;
      // Check name is duplicated or not
      let nameUsed = await this.NameValidator.validateEnvironmentName(name);
      if (nameUsed) {
        this.Notifications.error('Failure', true, 'This name is been used, please try another one');
        return;
      }
      await this.EndpointService.createAzureEndpoint(name, azureApplicationId, azureTenantId, azureAuthenticationKey, groupId, tagIds);
      this.Notifications.success('Environment connected', name);
      this.clearForm();
      this.onUpdate();
    } catch (err) {
      this.Notifications.error('Failure', err, 'Unable to connect your environment');
      this.state.actionInProgress = false;
    }

    this.onAnalytics('aci-api');
  }

  clearForm() {
    this.formValues = {
      name: '',
      azureApplicationId: '',
      azureTenantId: '',
      azureAuthenticationKey: '',
    };
  }

  $onInit() {
    return this.$async(async () => {
      this.state = {
        actionInProgress: false,
        endpointType: 'api',
        availableOptions: [buildOption('API', 'fa fa-bolt', 'API', '', 'api')],
      };
      this.formValues = {
        name: '',
        azureApplicationId: '',
        azureTenantId: '',
        azureAuthenticationKey: '',
      };
    });
  }
}