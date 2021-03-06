import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '.'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAllEnterPrises = () =>
  useAppSelector(state => state.allEnterprises)

export const useOnboardedEnterprises = () =>
  useAppSelector(state => state.onboardedEnterprises)

export const useAllEmployees = () => useAppSelector(state => state.allEmployees)

export const useOnboardedEmployees = () =>
  useAppSelector(state => state.onboardedEmployees)
