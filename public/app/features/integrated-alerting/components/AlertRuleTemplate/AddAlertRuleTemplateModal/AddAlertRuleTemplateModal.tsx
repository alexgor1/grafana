import { Modal, LoaderButton, TextareaInputField, validators, logger } from '@percona/platform-core';
import { Form, FormApi } from 'final-form';
import React, { FC, ChangeEvent, useCallback, useRef } from 'react';

import { AppEvents } from '@grafana/data';
import { Button, HorizontalGroup, Icon, useStyles } from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { Messages } from 'app/features/integrated-alerting/IntegratedAlerting.messages';

import { AlertRuleTemplateService } from '../AlertRuleTemplate.service';

import { getStyles } from './AddAlertRuleTemplateModal.styles';
import { AddAlertRuleTemplateModalProps, AlertRuleTemplateRenderProps } from './AddAlertRuleTemplateModal.types';

export const AddAlertRuleTemplateModal: FC<AddAlertRuleTemplateModalProps> = ({
  isVisible,
  setVisible,
  getAlertRuleTemplates,
}) => {
  const styles = useStyles(getStyles);
  const { required } = validators;
  const inputRef = useRef<HTMLInputElement>(null);
  const onUploadFile = useCallback(
    (change: FormApi['change']) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files.length > 0 ? event.target.files[0] : null;
      const reader = new FileReader();

      if (file) {
        reader.addEventListener('load', (e) => change('yaml', e.target.result));
        reader.readAsText(event.target.files[0]);
      }
    },
    []
  );
  const onSubmit = async (values: AlertRuleTemplateRenderProps) => {
    try {
      await AlertRuleTemplateService.upload(values);
      setVisible(false);
      appEvents.emit(AppEvents.alertSuccess, [Messages.alertRuleTemplate.addSuccess]);
      getAlertRuleTemplates();
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Modal title={Messages.alertRuleTemplate.addModal.title} isVisible={isVisible} onClose={() => setVisible(false)}>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, valid, pristine, submitting, form: { change } }) => (
          <form onSubmit={handleSubmit}>
            <>
              <input type="file" accept=".yml, .yaml" ref={inputRef} onChange={onUploadFile(change)} hidden />
              <TextareaInputField
                name="yaml"
                label={Messages.alertRuleTemplate.addModal.fields.alertRuleTemplate}
                validators={[required]}
                className={styles.alertRuleTemplate}
              />
              <Button
                type="button"
                data-qa="alert-rule-template-upload-button"
                size="md"
                variant="secondary"
                className={styles.uploadAction}
                onClick={() => inputRef.current.click()}
              >
                <Icon name="upload" />
                {Messages.alertRuleTemplate.addModal.upload}
              </Button>
              <HorizontalGroup justify="center" spacing="md">
                <LoaderButton
                  data-qa="alert-rule-template-add-button"
                  size="md"
                  variant="primary"
                  disabled={!valid || pristine}
                  loading={submitting}
                >
                  {Messages.alertRuleTemplate.addModal.confirm}
                </LoaderButton>
              </HorizontalGroup>
            </>
          </form>
        )}
      />
    </Modal>
  );
};
