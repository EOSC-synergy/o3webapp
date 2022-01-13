import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import React from 'react';

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
    borderColor: "#d3d3d3",
    borderSize: "1px",
    borderStyle: "solid",
    margin: "3px",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}));

const fullTextSearch = (elem, searchStr) => {
    const elemVals = Object.values(elem)
    return elemVals.reduce((prev, curr) => {
        if (prev) return true;
        return String(curr).toLowerCase().includes(searchStr.toLowerCase()) // String(...)
    }, false)
}

/**
 * Searches for occurences of a string in an array. 
 * Eeach item in the array that has the searchString as a substring is a valid search result.
 * 
 * @param {*} array holds the items that are searched
 * @param {*} searchString specifies what should be searched for
 * @returns {array} containing the indices of all elements in the array where the searchString matched
 */
const performSearch = (array, searchString) => {
    console.log(searchString)
    let arrayMappedToIndices = array.map(
        (elem, index) => ({index, value: elem})
    )
    arrayMappedToIndices = arrayMappedToIndices.filter(
        ({index, value}) => fullTextSearch(value, searchString)
    )
    
    return arrayMappedToIndices.map(({index, value}) => index)
}

/**
 * A searchbar component that is used for searching a string in a data array
 
 * @param {*} props 
 * @param {array} props.inputArray todo
 * @param {function} props.foundIndicesCallback todo
 * @returns {JSX} a pretty searchbar component
 */
export default function SearchBar(props) {

    const { inputArray, foundIndicesCallback } = props;

    const [input, setInput] = React.useState("");

    const handleInputChange = (event) => {
        const newInput = event.target.value
        
        setInput(newInput);
        foundIndicesCallback(performSearch(inputArray, newInput));
    }
    
    return (
    <Search>
        <SearchIconWrapper>
            <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={input}
            onChange={handleInputChange}
        />
    </Search>
    )

}
