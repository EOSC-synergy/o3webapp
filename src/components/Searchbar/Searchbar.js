import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import React from 'react';
import { performSearch } from '../../utils/textSearch';
import PropTypes from 'prop-types';

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
        width: '50ch',
      },
    },
}));




/**
 * A searchbar component that is used for searching a string in a data array
 * that either contains strings or objects. If the array contains objects the
 * values of these objects are searched.
 
 * @param {Object} props holds all props passed to the component
 * @param {array} props.inputArray an array of either only strings or only objects.
 *                                 The input typed in the searchbar is used as a search
 *                                 string. If an array of objects is passed the values of
 *                                 each object are searched.
 * @param {function} props.foundIndicesCallback this function is called with an array 
 *                                              containing the indices that matched the 
 *                                              search string. The function is called after the
 *                                              search is performed.
 * @param {boolean} props.shouldReturnValues specifies whether the searchbar should pass indices or values
 *          to props.foundIndicesCallback
 * @returns {JSX} a pretty searchbar component
 */
export default function SearchBar(props) {

    const { inputArray, foundIndicesCallback } = props;
    let shouldReturnValues = false;
    if ('shouldReturnValues' in props) {
      shouldReturnValues = props.shouldReturnValues;
    }

    const handleInputChange = (event) => {
        const newInput = event.target.value
        foundIndicesCallback(performSearch(inputArray, newInput, shouldReturnValues));
    }
    
    return (
    <Search>
        <SearchIconWrapper>
            <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search', 'alt': 'Searchbar', 'data-testid': 'SearchbarInput'}}
            onBlur={handleInputChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleInputChange(event);
              }
            }}
        />
    </Search>
    )
};

SearchBar.propTypes = {
  inputArray: PropTypes.array.isRequired,
  foundIndicesCallback: PropTypes.func.isRequired,
}
