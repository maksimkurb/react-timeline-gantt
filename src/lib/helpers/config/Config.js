const configDefaults = {
  header: {
    top: {
      style: {
        backgroundColor: '#333333',
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
      },
    },
    middle: {
      style: {
        backgroundColor: 'chocolate',
      },
      selectedStyle: {
        backgroundColor: '#b13525',
        fontWeight: 'bold',
      },
    },
    bottom: {
      style: {
        background: 'grey',
        color: 'white',
        fontSize: 9,
      },
      selectedStyle: {
        backgroundColor: '#b13525',
        fontWeight: 'bold',
      },
    },
  },
  taskList: {
    title: {
      label: 'Projects',
      style: {
        backgroundColor: '#333333',
        borderBottom: 'solid 1px silver',
        color: 'white',
        textAlign: 'center',
      },
    },
    task: {
      style: {
        backgroundColor: '#fbf9f9',
      },
    },
    verticalSeparator: {
      style: {
        backgroundColor: '#333333',
      },
      grip: {
        style: {
          backgroundColor: '#cfcfcd',
        },
      },
    },
  },
  dataViewPort: {
    rows: {
      style: {
        backgroundColor: '#fbf9f9',
        borderBottom: 'solid 0.5px #cfcfcd',
      },
    },
    task: {
      showLabel: false,

      style: {
        position: 'absolute',
        borderRadius: 14,
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'grey',
      },
      selectedStyle: {
        position: 'absolute',
        borderRadius: 14,
        border: 'solid 1px #ff00fa',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'grey',
      },
    },
  },
  links: {
    color: 'black',
    selectedColor: '#ff00fa',
  },
};

class Config {
  constructor() {
    this.data = configDefaults;
  }

  load = values => {
    this.data = {};
    if (values) this.populate(values, configDefaults, this.data);
    else this.data = configDefaults;
  };

  populate(values, defaults, final) {
    if (!this.isObject(defaults)) return;
    Object.keys(defaults).forEach(key => {
      if (!values[key]) {
        // if not exits
        final[key] = defaults[key]; // eslint-disable-line no-param-reassign
      } else {
        // if it does
        final[key] = values[key]; // eslint-disable-line no-param-reassign
        this.populate(values[key], defaults[key], final[key]);
      }
    });
  }

  isObject(value) {
    if (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      typeof value === 'number'
    )
      return false;
    return true;
  }

  get values() {
    return this.data;
  }
}

const config = new Config();
export default config;
