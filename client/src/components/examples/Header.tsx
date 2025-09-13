import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header 
      onSuggestPrompt={() => console.log('Suggest prompt clicked')}
    />
  );
}