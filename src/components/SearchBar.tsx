import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React, { FC } from 'react';
import { performSearch } from 'utils/textSearch';
import PropTypes from 'prop-types';
import useId from '@mui/utils/useId';

/**
 * A JSX Element containing a wrapper for a SearchIcon. Wrapped by {@link SearchBar.Search}.
 *
 * @memberof SearchBar
 * @constant {JSX.Element}
 */
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

/**
 * A JSX Element that wraps the [SearchIconWrapper]{@link SearchBar.SearchIconWrapper} and the
 * [StyledInputBase]{@link SearchBar.StyledInputBase}.
 *
 * @memberof SearchBar
 * @constant {JSX.Element}
 */
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
    borderColor: '#d3d3d3',
    borderSize: '1px',
    borderStyle: 'solid',
    margin: '3px',
}));

/**
 * A JSX Element that contains a styled Input Base. Wrapped by {@link SearchBar.Search}.
 *
 * @memberof SearchBar
 * @constant {JSX.Element}
 */
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

type SearchBarProps = {
    shouldReturnValues?: boolean;
    inputArray: (string | object)[];
    foundIndicesCallback: (indices: unknown[]) => void;
};
/**
 * A searchbar component that is used for searching a string in a data array that either contains
 * strings or objects. If the array contains objects the values of these objects are searched.
 *
 * @param {Object} props Further specified in propTypes
 * @returns {JSX} A pretty searchbar component
 * @component
 */
const SearchBar: FC<SearchBarProps> = ({
    shouldReturnValues = false,
    inputArray,
    foundIndicesCallback,
}) => {
    /**
     * Handles the change of the input -> performs the search
     *
     * @param newInput New text in the input
     * @see {@link module:TextSearch.performSearch}
     */
    const handleInputChange = (newInput: string) => {
        foundIndicesCallback(performSearch(inputArray, newInput, shouldReturnValues));
    };

    const id = useId();

    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search…"
                inputProps={{
                    'aria-label': 'search',
                    alt: 'Searchbar',
                    'data-testid': 'SearchbarInput',
                }}
                id={id}
                onBlur={(e) => handleInputChange(e.target.value)}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        // TODO: better way about this?
                        handleInputChange(
                            (
                                document.getElementById(id!)! as
                                    | HTMLInputElement
                                    | HTMLTextAreaElement
                            ).value
                        );
                    }
                }}
            />
        </Search>
    );
};

SearchBar.propTypes = {
    inputArray: PropTypes.array.isRequired,
    foundIndicesCallback: PropTypes.func.isRequired,
};

export default SearchBar;
