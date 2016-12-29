const search = (state = {}, action) => {
  switch(action.type) {
    case 'LINKED_TO_SEARCH_PAGE':
      return {
        collection: action.collection,
        id: action.id
      };
    case 'SET_SEARCH_DATA':
      return {
        ...state,
        items: action.items,
        visibleItems: action.items,
        recUsers: action.recUsers
      };
    case 'SEARCH_INPUT_CHANGE':
      var visibleItems = [];
      state.items.forEach(item => {
        if (item.name.search(action.value) != -1) {
          visibleItems.push(item);
        }
      });
      return {
        ...state,
        input: action.value,
        visibleItems
      };
    case 'HANDLE_SEARCH_SORT':
      var sortedItems = [ ...state.visibleItems ];
      sortedItems.sort((a, b) => a.name > b.name);
      return {
        ...state,
        visibleItems: sortedItems,
        itemsSorted: true
      };
    default:
      return state;
  }
};

export default search;