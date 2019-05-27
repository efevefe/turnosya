//este index sirve para que no tengamos que andar importando cada componente por separado y podamos hacer destructuring en cambio

export * from './Button';
export * from './Card';
export * from './CardSection';
export * from './Header';
export * from './Input';
export * from './Spinner';
export * from './InputPicker';
export * from './Confirm';

//si exporto con *, en el componente no puedo exportar con 'default' y debo exportar asi:
//> export { Component }