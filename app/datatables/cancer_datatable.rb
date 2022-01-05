class CancerDatatable < ApplicationDatatable
    private
  
    def data
      cancers.map do |cancer|
        [].tap do |column|
          column << ""
          Cancer.column_names.each do |attr|
            if attr != 'cover_image'
              if attr != 'id'
                  column << "<div class='table_cell'> #{cancer[attr]} </div>"
              else
                  column << cancer[attr]
              end
            end
          end
          column << link_to('Show', cancer)
        end
      end
    end
  
    def count
      Cancer.count
    end
  
    def total_entries
      cancers.total_count
      # will_paginate
      # users.total_entries
    end
  
    def cancers
      @cancers ||= fetch_cancers
    end
  
    def fetch_cancers
      search_string = []
      Cancer.column_names.each do |attr|
        if Cancer.columns_hash[attr].type != :string
          search_string << "cast(\"#{attr}\" as varchar(10)) like :search"
        else
          search_string << "\"#{attr}\" like :search"
        end
      end
      # search_col =['project_name', 'project_name', 'experiment_type']
      # search_col.each do |term|
      #   search_string << "#{term} like :search"
      # end
  
      # will_paginate
      # users = User.page(page).per_page(per_page)
      cancers = Cancer.order("#{sort_column} #{sort_direction}")
      cancers = cancers.page(page).per(per_page)
      if params[:search][:value] != ""
        cancers = cancers.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
      else
        cancers = cancers.page(page).per(per_page)
      end
      #projects = projects.where(search_string.join(' or '), search: "%#{params[:search][:value]}%")
    end
  
    def columns
      Cancer.column_names
      # %w(first_name last_name email phone_number)
    end
  end