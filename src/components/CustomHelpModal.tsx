import React, {useState} from 'react';
import {Modal, View, Text, TouchableOpacity, Image} from 'react-native';
import CloseIcon from 'react-native-vector-icons/Ionicons';
import CameraIcon from 'react-native-vector-icons/Ionicons';
import tw from '../../tailwind';
import markerIcon from '../assets/images/diamond-2.png';

const CustomHelpModal = ({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pages = [
    'Getting to the diamond spots on the map earns you bonus diamonds!',
    'Click the camera button to record your journey and view them in My Memories!',
    'The blue line on the map represents the path you can walk.',
    'The red line on the map represents the path you have walked.',
  ];
  const [currentPage, setCurrentPage] = useState(0);

  const handleClose = () => {
    setModalVisible(false);
    setCurrentPage(0);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        handleClose();
      }}>
      <View style={tw`flex-1 justify-center items-center mt-6`}>
        <View style={tw`m-5 bg-white rounded-xl p-9 items-center shadow-md`}>
          <CloseIcon
            name="close-circle-outline"
            size={30}
            style={tw`absolute top-2 right-2`}
            onPress={() => setModalVisible(false)}
          />
          {currentPage == 0 ? (
            <Image source={markerIcon} style={tw`h-8 w-8 mb-3`} />
          ) : null}
          {currentPage == 1 ? (
            <CameraIcon
              name="camera"
              size={32}
              style={tw`mb-3 text-primary-blue`}
            />
          ) : null}
          <Text style={tw`text-md`}>{pages[currentPage]}</Text>
          <View style={tw`flex flex-row gap-5`}>
            <TouchableOpacity
              style={tw`bg-primary-blue w-20 h-8 rounded-md mt-4 flex items-center justify-center`}
              onPress={() => {
                if (currentPage > 0) {
                  setCurrentPage(currentPage - 1);
                } else {
                  setModalVisible(false);
                }
              }}>
              <Text style={tw`text-md text-white`}>
                {' '}
                {currentPage === 0 ? 'Close' : 'Previous'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-primary-blue w-20 h-8 rounded-md mt-4 flex items-center justify-center`}
              onPress={() => {
                if (currentPage < pages.length - 1) {
                  setCurrentPage(currentPage + 1);
                } else {
                  setModalVisible(false);
                  setCurrentPage(0);
                }
              }}>
              <Text style={tw`text-white text-md`}>
                {currentPage < pages.length - 1 ? 'Next' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomHelpModal;
