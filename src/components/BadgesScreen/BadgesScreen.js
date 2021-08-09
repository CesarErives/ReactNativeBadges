import React from 'react'
import { 
    View, 
    ActivityIndicator, 
    StyleSheet, 
    FlatList,
    StatusBar,
    Text,
    Alert,
    TouchableOpacityBase,
} from 'react-native'
import BadgesItem from './BadgesItem'
import Loader from '../../Generics/Loader'
import Storage from '../../libs/storage'
import Colors from '../../res/Colors'
import Http from '../../libs/http'
import BadgesSearch from './BadgesSearch'

class BadgesScreen extends React.Component{
    state = {
        loading: false,
        badges: undefined,
        badgesCopy: undefined,
    }

    componentDidMount(){
        this.fetchdata();
        this.focusEvent();
        this.blurEvent();
    }
    //Set the time for the fetch
    focusEvent = () => {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setFetchInterval();
        });
    };
    //Restart the count for the fetch
    blurEvent = () => {
        this.blurListener = this.props.navigation.addListener('blur', () => {
            clearInterval(this.interval);
        });
    };

    setFetchInterval = () => {
        this.interval = setInterval(this.fetchdata, 3000);
    };
    //Get the badges
    fetchdata = async() => {
        console.log('Fetching data');
        this.setState({loading: true});
        let response = await Http.instance.get_all();
        this.setState({loading: false, badges: response, badgesCopy: response});
    };
    //Badge detail open
    handlePress = item => {
        this.props.navigation.navigate('BadgesDetail', {item});
    };
    //To go to the edit screen
    handleEdit = item => {
        console.log(this.props.navigation);
        this.props.navigation.navigate('BadgesEdit', {item});
    };

    
    //To search for a badge
    handleChange = query => {
        const {badgesCopy} = this.state;
        
        const badgesFiltered = badgesCopy.filter( badge => {
            return badge.name.toLowerCase().includes(query.toLowerCase());
        });
        this.setState({badges: badgesFiltered});
    
        if(query){
            clearInterval(this.interval);
        } else {
            this.setFetchInterval();
        }
    };

    handleDelete =  item => {
        Alert.alert(
            'Delete Badge',
            `Do you really want to delete ${item.name}'s badge?\n\nThis process cannot be undone`,
            [
                {
                    text: 'Cancel',
                    style:'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        this.setState({loading: true, badges: undefined});
                        await Http.instance.remove(item._id);
                        let key = `favorite-${item._id}`;
                        await Storage.instance.remove(key);
                        this.fetchdata();
                    },
                    style: 'destructive',
                },
            ],
            {
                cancelable: true,
            },
        );
    };

    componentWillUnmount() {
        this.focusListener();
        this.blurListener();
    }

    render(){
        const {badges, loading} = this.state;
        if(loading == true && !badges){
            return <Loader />;
        }
        return(
            <View style={[styles.container, styles.horizontal]}>
                <StatusBar backgroundColor="transparent" translucent={true} />
                <BadgesSearch onChange={this.handleChange} />
                <FlatList 
                style={styles.list} 
                data={badges} 
                renderItem={({item}) => (
                    <BadgesItem 
                        item={item} 
                        onPress={() => this.handlePress(item)} 
                        onEdit={()=>this.handleEdit(item)}
                        onDelete={()=>this.handleDelete(item)}
                    />
                )}
                keyExtractor = {(item, index) => index.toString()}
                />  
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.charade,
    },
    horizontal:{
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    loader:{
        height: '100%',
        paddingHorizontal: 10,
    },
    list:{
        width: '100%',
        paddingHorizontal: 10,
    },
});

export default BadgesScreen;