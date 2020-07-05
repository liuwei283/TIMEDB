module ApplicationHelper
  BS_CLASS = {
    'success': 'success',
    'error': 'danger',
    'alert': 'warning',
    'notice': 'info'
  }.freeze

  def bootstrap_class_for_flash(flash_type)
    BS_CLASS[flash_type] || flash_type.to_s
  end
end
