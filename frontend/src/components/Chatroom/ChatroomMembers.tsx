import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '../../components/Auth/AuthContext'; // Adjust the path as necessary
import { Box, List, ListItem, Text } from "@chakra-ui/react";

interface Member {
  id: string;
  displayName: string;
}

interface ChatroomMembersProps {
  chatroomId: string;
}

const ChatroomMembers: React.FC<ChatroomMembersProps> = ({ chatroomId }) => {
  const { currentUser, profile } = useAuth() || {};
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const chatroomRef = doc(firestore, 'chatrooms', chatroomId);
      const chatroomSnapshot = await getDoc(chatroomRef);
      const chatroomData = chatroomSnapshot.data();
      
      if (chatroomData?.members) {
        const membersPromises = chatroomData.members.map(async (memberId: string) => {
          const userRef = doc(firestore, 'users', memberId);
          const userSnapshot = await getDoc(userRef);
          const userData = userSnapshot.data();
          return { id: memberId, displayName: userData?.displayName || 'Unknown' };
        });

        const membersData = await Promise.all(membersPromises);
        setMembers(membersData);
      }
    };

    fetchMembers();
  }, [chatroomId]);

  return (
    <Box textAlign="center" p={4}>
      <Text fontSize="2xl" mb={4}>Members</Text>
      <List spacing={3}>
        {members.map((member) => (
          <ListItem 
            key={member.id} 
            bg={member.id === currentUser?.uid ? "blue.100" : "gray.100"}
            p={3}
            borderRadius="md"
          >
            <Text>{member.id === currentUser?.uid ? profile?.displayName : member.displayName}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatroomMembers;
