import { useGetReportSummaryQuery } from '@/Services/enterprise'
import { Colors } from '@/Theme/Variables'
import { useNavigation } from '@react-navigation/native'
import { Text } from 'native-base'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

const SUMMARY: ViewStyle = {
  backgroundColor: Colors.primary,
  padding: 8,
  borderRadius: 8,
}

const SummaryItem = ({
  text,
  count,
  isWarning,
  margin = true,
}: {
  text: string
  count: number
  isWarning?: boolean
  margin?: boolean
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingVertical: 12,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: margin ? 8 : 0,
      }}
    >
      <Text
        style={{
          color: isWarning ? Colors.warning : Colors.primary,
          fontSize: 16,
          fontWeight: '500',
        }}
      >
        {count}
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontSize: 12,
          fontWeight: '500',
        }}
      >
        {text}
      </Text>
    </View>
  )
}

function ReportSummary() {
  const { t } = useTranslation()
  const { data: reportSummary, refetch } = useGetReportSummaryQuery()
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch()
    })
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  return (
    <View style={SUMMARY}>
      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: Colors.white,
          fontWeight: '500',
        }}
      >
        {' '}
        {t`enterpriseScreen.reportSummary`}
      </Text>
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <SummaryItem
          text={t`enterpriseScreen.agreedToMeet`}
          count={
            reportSummary?.find(item => item.status === 'AGREED_TO_MEET')
              ?.total || 0
          }
          margin={false}
        />
        <SummaryItem
          text={t`enterpriseScreen.agreedToJoin`}
          count={
            reportSummary?.find(item => item.status === 'AGREED_TO_JOIN')
              ?.total || 0
          }
        />
        <SummaryItem
          text={t`enterpriseScreen.persuading`}
          count={
            reportSummary?.find(item => item.status === 'PERSUADING')?.total ||
            0
          }
        />
      </View>

      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <SummaryItem
          text={t`enterpriseScreen.inProcessing`}
          count={
            reportSummary?.find(item => item.status === 'DOCUMENT_REVIEWING')
              ?.total || 0
          }
          margin={false}
          isWarning
        />
        <SummaryItem
          text={t`enterpriseScreen.inAssessment`}
          count={
            reportSummary?.find(item => item.status === 'ASSESSMENT')?.total ||
            0
          }
          isWarning
        />
        <SummaryItem
          text={t`enterpriseScreen.rejected`}
          count={
            reportSummary?.find(item => item.status === 'REJECTED')?.total || 0
          }
          isWarning
        />
      </View>
    </View>
  )
}

export default ReportSummary
