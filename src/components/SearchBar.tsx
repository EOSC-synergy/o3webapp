import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React from 'react';
import useId from '@mui/utils/useId';

/**
 * A JSX Element containing a wrapper for a SearchIcon.
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

type SearchableObject = string | Record<string | number | symbol, unknown>;

/**
 * Performs a simple full text search on the given element and looks for the given search string.
 *
 * @category Utils
 * @param elem Single nested object or a string
 * @param searchStr What shall be searched for
 * @returns True if the object contains the string somewhere
 */
function objectContainsString(elem: SearchableObject, searchStr: string) {
    const lowerSearchStr = searchStr.toLowerCase();
    if (typeof elem === 'string') {
        return elem.toLowerCase().includes(lowerSearchStr);
    } else {
        const elemValues = Object.values(elem);

        for (const value of elemValues) {
            if (String(value).toLowerCase().includes(lowerSearchStr)) {
                return true;
            }
        }
        return false;
    }
}

type SearchBarProps<T extends SearchableObject> = {
    inputArray: T[];
    onFilteredItems: (indices: T[]) => void;
};
function SearchBar<T extends SearchableObject>({ inputArray, onFilteredItems }: SearchBarProps<T>) {
    const handleInputChange = (newInput: string) => {
        onFilteredItems(inputArray.filter((entry) => objectContainsString(entry, newInput)));
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
}

export default SearchBar;
