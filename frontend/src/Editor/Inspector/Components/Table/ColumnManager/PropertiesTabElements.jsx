import React, { useEffect } from 'react';
import { resolveReferences } from '@/_helpers/utils';
import SelectSearch from 'react-select-search';
import { useTranslation } from 'react-i18next';
import { CodeHinter } from '../../../../CodeBuilder/CodeHinter';
import { EventManager } from '../../../EventManager';
import { ProgramaticallyHandleProperties } from '../ProgramaticallyHandleProperties';
import { DatePickerProperties } from './DatePickerProperties';
import { ValidationProperties } from './ValidationProperties';
export const PropertiesTabElements = ({
  column,
  index,
  darkMode,
  currentState,
  onColumnItemChange,
  getPopoverFieldSource,
  setColumnPopoverRootCloseBlocker,
  component,
  props,
  columnEventChanged,
  handleEventManagerPopoverCallback,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="field" data-cy={`dropdown-column-type`}>
        <label data-cy={`label-column-type`} className="form-label">
          {t('widget.Table.columnType', 'Column type')}
        </label>
        <SelectSearch
          className={`${darkMode ? 'select-search' : 'select-search'}`}
          options={[
            { name: 'Default', value: 'default' },
            { name: 'String', value: 'string' },
            { name: 'Number', value: 'number' },
            { name: 'Text', value: 'text' },
            { name: 'Badge', value: 'badge' },
            { name: 'Multiple badges', value: 'badges' },
            { name: 'Tags', value: 'tags' },
            { name: 'Dropdown', value: 'dropdown' },
            { name: 'Link', value: 'link' },
            { name: 'Radio', value: 'radio' },
            { name: 'Multiselect', value: 'multiselect' },
            { name: 'Toggle switch', value: 'toggle' },
            { name: 'Date Picker', value: 'datepicker' },
            { name: 'Image', value: 'image' },
            { name: 'Boolean', value: 'boolean' },
          ]}
          value={column.columnType}
          search={true}
          closeOnSelect={true}
          onChange={(value) => {
            onColumnItemChange(index, 'columnType', value);
          }}
          fuzzySearch
          placeholder={t('globals.select', 'Select') + '...'}
        />
      </div>
      <div className="field" data-cy={`input-and-label-column-name`}>
        <label data-cy={`label-column-name`} className="form-label">
          {t('widget.Table.columnName', 'Column name')}
        </label>
        <CodeHinter
          currentState={currentState}
          initialValue={column.name}
          theme={darkMode ? 'monokai' : 'default'}
          mode="javascript"
          lineNumbers={false}
          placeholder={column.name}
          onChange={(value) => onColumnItemChange(index, 'name', value)}
          componentName={getPopoverFieldSource(column.columnType, 'name')}
          popOverCallback={(showing) => {
            setColumnPopoverRootCloseBlocker('name', showing);
          }}
        />
      </div>
      <div data-cy={`input-and-label-key`} className="field">
        <label className="form-label">{t('widget.Table.key', 'key')}</label>
        <CodeHinter
          currentState={currentState}
          initialValue={column.key}
          theme={darkMode ? 'monokai' : 'default'}
          mode="javascript"
          lineNumbers={false}
          placeholder={column.name}
          onChange={(value) => onColumnItemChange(index, 'key', value)}
          componentName={getPopoverFieldSource(column.columnType, 'key')}
          popOverCallback={(showing) => {
            setColumnPopoverRootCloseBlocker('tableKey', showing);
          }}
        />
      </div>
      {column.columnType === 'toggle' && (
        <div>
          <EventManager
            sourceId={props?.component?.id}
            eventSourceType="table_column"
            hideEmptyEventsAlert={true}
            eventMetaDefinition={{ events: { onChange: { displayName: 'On change' } } }}
            currentState={currentState}
            dataQueries={props.dataQueries}
            components={props.components}
            eventsChanged={(events) => columnEventChanged(column, events)}
            apps={props.apps}
            popOverCallback={(showing) => {
              handleEventManagerPopoverCallback(showing);
            }}
            pages={props.pages}
          />
        </div>
      )}
      {(column.columnType === 'dropdown' ||
        column.columnType === 'multiselect' ||
        column.columnType === 'badge' ||
        column.columnType === 'badges' ||
        column.columnType === 'radio') && (
        <div>
          <div data-cy={`input-and-label-values`} className="field mb-2">
            <label className="form-label">{t('widget.Table.values', 'Values')}</label>
            <CodeHinter
              currentState={currentState}
              initialValue={column.values}
              theme={darkMode ? 'monokai' : 'default'}
              mode="javascript"
              lineNumbers={false}
              placeholder={'{{[1, 2, 3]}}'}
              onChange={(value) => onColumnItemChange(index, 'values', value)}
              componentName={getPopoverFieldSource(column.columnType, 'values')}
              popOverCallback={(showing) => {
                setColumnPopoverRootCloseBlocker('values', showing);
              }}
            />
          </div>
          <div data-cy={`input-and-label-labels`} className="field mb-2">
            <label className="form-label">{t('widget.Table.labels', 'Labels')}</label>
            <CodeHinter
              currentState={currentState}
              initialValue={column.labels}
              theme={darkMode ? 'monokai' : 'default'}
              mode="javascript"
              lineNumbers={false}
              placeholder={'{{["one", "two", "three"]}}'}
              onChange={(value) => onColumnItemChange(index, 'labels', value)}
              componentName={getPopoverFieldSource(column.columnType, 'labels')}
              popOverCallback={(showing) => {
                setColumnPopoverRootCloseBlocker('labels', showing);
              }}
            />
          </div>
        </div>
      )}
      {column.columnType === 'datepicker' && (
        <DatePickerProperties
          column={column}
          index={index}
          darkMode={darkMode}
          currentState={currentState}
          onColumnItemChange={onColumnItemChange}
          component={component}
        />
      )}
      {column.columnType === 'link' && (
        <div className="field">
          <ProgramaticallyHandleProperties
            label="Link target"
            currentState={currentState}
            index={index}
            darkMode={darkMode}
            callbackFunction={onColumnItemChange}
            property="linkTarget"
            props={column}
            component={component}
            paramMeta={{
              type: 'select',
              displayName: 'Link Target',
              options: [
                { name: 'Same window', value: '_self' },
                { name: 'New window', value: '_blank' },
              ],
            }}
            paramType="properties"
          />
        </div>
      )}
      {column.columnType === 'number' && (
        <CodeHinter
          currentState={currentState}
          initialValue={column?.decimalPlaces}
          theme={darkMode ? 'monokai' : 'default'}
          mode="javascript"
          lineNumbers={false}
          placeholder={'{{2}}'}
          onChange={(value) => onColumnItemChange(index, 'decimalPlaces', value)}
          componentName={getPopoverFieldSource(column.columnType, 'decimalPlaces')}
          popOverCallback={(showing) => {
            console.log('arpit ::', { showing });
            setColumnPopoverRootCloseBlocker('decimalPlaces', showing);
          }}
        />
      )}
      {!['image', 'link'].includes(column.columnType) && (
        <ProgramaticallyHandleProperties
          label="make editable"
          currentState={currentState}
          index={index}
          darkMode={darkMode}
          callbackFunction={onColumnItemChange}
          property="isEditable"
          props={column}
          component={component}
          paramMeta={{ type: 'toggle', displayName: 'Make editable' }}
          paramType="properties"
        />
      )}
      {resolveReferences(column?.isEditable, currentState) && (
        <ValidationProperties
          column={column}
          index={index}
          darkMode={darkMode}
          currentState={currentState}
          onColumnItemChange={onColumnItemChange}
          getPopoverFieldSource={getPopoverFieldSource}
          setColumnPopoverRootCloseBlocker={setColumnPopoverRootCloseBlocker}
        />
      )}
      <ProgramaticallyHandleProperties
        label="Column visibility"
        currentState={currentState}
        index={index}
        darkMode={darkMode}
        callbackFunction={onColumnItemChange}
        property="columnVisibility"
        props={column}
        component={component}
        paramMeta={{ type: 'toggle', displayName: 'Column visibility' }}
        paramType="properties"
      />
    </>
  );
};
