import React from 'react';
import { UniqueConstraintPopOver } from '../Table/ActionsPopover/UniqueConstraintPopOver';
import { ToolTip } from '@/_components/ToolTip';
import Serial from '../Icons/Serial.svg';
import ForeignKeyRelation from '../Icons/Fk-relation.svg';
import IndeterminateCheckbox from '@/_ui/IndeterminateCheckbox';
import SelectIcon from '../Icons/Select-column.svg';
import MenuIcon from '../Icons/Unique-menu.svg';
// import DeleteIcon from '../Icons/DeleteIcon.svg';
import Tick from '../Icons/Tick.svg';
import tjdbDropdownStyles, { dataTypes, formatOptionLabel, defaultdataType } from '../constants';
import Select, { components } from 'react-select';

function TableSchema({ columns, setColumns, darkMode, columnSelection, setColumnSelection, handleDelete }) {
  const { Option } = components;

  const darkDisabledBackground = '#1f2936';
  const lightDisabledBackground = '#f4f6fa';
  const lightFocussedBackground = '#fff';
  const darkFocussedBackground = 'transparent';
  const lightBackground = '#fff';
  const darkBackground = 'transparent';

  const darkBorderHover = '#dadcde';
  const lightBorderHover = '#dadcde';

  const darkDisabledBorder = '#3a3f42';
  const lightDisabledBorder = '#dadcde';
  const lightFocussedBorder = '#90B5E2 !important';
  const darkFocussedBorder = '#90b5e2 !important';
  const lightBorder = '#dadcde';
  const darkBorder = '#dadcde';
  const dropdownContainerWidth = '360px';

  const CustomSelectOption = (props) => (
    <Option {...props}>
      <div className="selected-dropdownStyle d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center justify-content-start">
          <div>{props.data.icon}</div>
          <span className="dataType-dropdown-label">{props.data.label}</span>
          <span className="dataType-dropdown-value">{props.data.name}</span>
        </div>
        <div>
          {columns[columnSelection.index].data_type === props.data.value ? (
            <div>
              <Tick width="16" height="16" />
            </div>
          ) : null}
        </div>
      </div>
    </Option>
  );

  const customStyles = tjdbDropdownStyles(
    darkMode,
    darkDisabledBackground,
    lightDisabledBackground,
    lightFocussedBackground,
    darkFocussedBackground,
    lightBackground,
    darkBackground,
    darkBorderHover,
    lightBorderHover,
    darkDisabledBorder,
    lightDisabledBorder,
    lightFocussedBorder,
    darkFocussedBorder,
    lightBorder,
    darkBorder,
    dropdownContainerWidth
  );

  const toolTipPlacementStyle = {
    width: '126px',
  };

  return (
    <div>
      {Object.keys(columns).map((index) => (
        <div key={index} className="list-group-item mb-1 mt-2 table-schema">
          <div className="table-schema-row">
            {/* <div className="col-1">
                  <DragIcon />
                </div> */}
            <div className="m-0 pe-0 ps-1 columnName" data-cy="column-name-input-field">
              <input
                onChange={(e) => {
                  e.persist();
                  const prevColumns = { ...columns };
                  prevColumns[index].column_name = e.target.value;
                  setColumns(prevColumns);
                }}
                value={columns[index].column_name}
                type="text"
                className="form-control"
                placeholder="Enter name"
                data-cy={`name-input-field-${columns[index].column_name}`}
                // disabled={columns[index]?.constraints_type?.is_primary_key === true}
              />
            </div>
            <div className="foreign-key-relation">
              <ForeignKeyRelation width="14" height="14" />
            </div>
            <div className="p-0 datatype-dropdown" data-cy="type-dropdown-field">
              <Select
                width="120px"
                height="36px"
                //useMenuPortal={false}
                defaultValue={columns[index]?.constraints_type?.is_primary_key === true ? defaultdataType : null}
                options={dataTypes}
                onChange={(value) => {
                  setColumnSelection((prevState) => ({
                    ...prevState,
                    index: index,
                    value: value.value,
                  }));
                  const prevColumns = { ...columns };
                  prevColumns[index].data_type = value ? value.value : null;
                  setColumns(prevColumns);
                }}
                components={{
                  Option: CustomSelectOption,
                  IndicatorSeparator: () => null,
                }}
                styles={customStyles}
                formatOptionLabel={formatOptionLabel}
                placeholder={
                  columns[index].data_type === 'serial' ? (
                    <div>
                      <span style={{ marginRight: '5px' }}>
                        <Serial width="16" />
                      </span>
                      <span>{columns[0].data_type}</span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ marginRight: '3px' }}>
                        <SelectIcon width="17" />
                      </span>
                      <span style={{ color: '#889096' }}>Select...</span>
                    </div>
                  )
                }
                onMenuOpen={() => {
                  setColumnSelection((prevState) => ({
                    ...prevState,
                    index: index,
                    value: columns[index]?.data_type,
                  }));
                }}
                onMenuClose={() => {
                  setColumnSelection({ index: 0, value: '' });
                }}
              />
            </div>
            <div className="m-0" data-cy="column-default-input-field">
              <input
                onChange={(e) => {
                  e.persist();
                  const prevColumns = { ...columns };
                  prevColumns[index].column_default = e.target.value;
                  setColumns(prevColumns);
                }}
                value={columns[index].column_default}
                type="text"
                className="form-control defaultValue"
                data-cy="default-input-field"
                placeholder={
                  (columns[index].data_type === 'serial' &&
                    columns[index]?.constraints_type?.is_primary_key === true) ||
                  columns[index].data_type === 'serial'
                    ? 'Auto-generated'
                    : 'Null'
                }
                disabled={
                  (columns[index].data_type === 'serial' &&
                    columns[index]?.constraints_type?.is_primary_key === true) ||
                  columns[index].data_type === 'serial'
                }
              />
            </div>

            <div className="primary-check">
              <IndeterminateCheckbox
                checked={columns[index]?.constraints_type?.is_primary_key ?? false}
                onChange={(e) => {
                  const prevColumns = { ...columns };
                  const columnConstraints = prevColumns[index]?.constraints_type ?? {};
                  // const data = e.target.checked === true ? true : false;
                  columnConstraints.is_primary_key = e.target.checked;
                  columnConstraints.is_not_null = true;
                  columnConstraints.is_unique = true;
                  prevColumns[index].constraints_type = { ...columnConstraints };
                  // prevColumns[index].data_type = data === false && '';
                  setColumns(prevColumns);
                }}
              />
            </div>

            {columns[index]?.constraints_type?.is_primary_key === true ? (
              <ToolTip
                message="Primary key values
cannot be null"
                placement="top"
                tooltipClassName="tootip-table"
                style={toolTipPlacementStyle}
              >
                <div className="d-flex not-null-toggle">
                  <label className={`form-switch`}>
                    <input
                      className="form-check-input"
                      data-cy={`${String(columns[index]?.constraints_type?.is_not_null ?? false ? 'NOT NULL' : 'NULL')
                        .toLowerCase()
                        .replace(/\s+/g, '-')}-checkbox`}
                      type="checkbox"
                      checked={columns[index]?.constraints_type?.is_not_null ?? false}
                      onChange={(e) => {
                        const prevColumns = { ...columns };
                        const columnConstraints = prevColumns[index]?.constraints_type ?? {};
                        columnConstraints.is_not_null = e.target.checked;
                        prevColumns[index].constraints_type = { ...columnConstraints };
                        setColumns(prevColumns);
                      }}
                      disabled={columns[index]?.constraints_type?.is_primary_key === true}
                    />
                  </label>
                  <p
                    data-cy={`${String(columns[index]?.constraints_type?.is_not_null ?? false ? 'NOT NULL' : 'NULL')
                      .toLowerCase()
                      .replace(/\s+/g, '-')}-text`}
                    className="m-0"
                  >
                    {columns[index]?.constraints_type?.is_not_null ?? false ? (
                      <span
                        className={`${
                          columns[index]?.constraints_type?.is_primary_key === true ? 'not-null-with-disable' : ''
                        }`}
                      >
                        NOT NULL
                      </span>
                    ) : (
                      <span>NULL</span>
                    )}
                  </p>
                </div>
              </ToolTip>
            ) : (
              <div className="d-flex not-null-toggle">
                <label className={`form-switch`}>
                  <input
                    className="form-check-input"
                    data-cy={`${String(columns[index]?.constraints_type?.is_not_null ?? false ? 'NOT NULL' : 'NULL')
                      .toLowerCase()
                      .replace(/\s+/g, '-')}-checkbox`}
                    type="checkbox"
                    checked={columns[index]?.constraints_type?.is_not_null ?? false}
                    onChange={(e) => {
                      const prevColumns = { ...columns };
                      const columnConstraints = prevColumns[index]?.constraints_type ?? {};
                      columnConstraints.is_not_null = e.target.checked;
                      prevColumns[index].constraints_type = { ...columnConstraints };
                      setColumns(prevColumns);
                    }}
                    disabled={columns[index]?.constraints_type?.is_primary_key === true}
                  />
                </label>
                <p
                  data-cy={`${String(columns[index]?.constraints_type?.is_not_null ?? false ? 'NOT NULL' : 'NULL')
                    .toLowerCase()
                    .replace(/\s+/g, '-')}-text`}
                  className="m-0"
                >
                  {columns[index]?.constraints_type?.is_not_null ?? false ? (
                    <span
                      className={`${
                        columns[index]?.constraints_type?.is_primary_key === true ? 'not-null-with-disable' : ''
                      }`}
                    >
                      NOT NULL
                    </span>
                  ) : (
                    <span>NULL</span>
                  )}
                </p>
              </div>
            )}

            <div>
              <UniqueConstraintPopOver
                disabled={false}
                onDelete={() => handleDelete(index)}
                darkMode={darkMode}
                columns={columns}
                setColumns={setColumns}
                index={index}
              >
                <div className="cursor-pointer">
                  <MenuIcon />
                </div>
              </UniqueConstraintPopOver>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TableSchema;
